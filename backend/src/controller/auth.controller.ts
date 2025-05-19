import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Student from "../models/student.model";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";
import FabricCAServices from "fabric-ca-client";
import { Wallets, X509Identity } from "fabric-network";
import { publicKeyFormat } from "../../utils/key-format";
import { RegisterUserBody } from "./../types/student-auth-types";

import fs from "fs";
import path from "path";

const registerStudent = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      confirm_password,
      phone_number,
      role = "user",
    } = req.body;

    if (password !== confirm_password) {
      res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
      return;
    }

    // Check if email is already registered in MongoDB
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      res.status(403).json({ success: false, message: "Email already used" });
      return;
    }

    // Connect to Fabric CA
    const ccpPath = path.resolve(
      __dirname,
      "./../../fabric-connection/connection.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
    if (!caInfo) {
      res.status(400).json({
        success: false,
        message:
          "Certificate Authority information not found in connection profile",
      });
      return;
    }

    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create wallet
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if user identity already exists in wallet
    const userIdentity = await wallet.get(name);
    if (userIdentity) {
      res.status(400).json({
        success: false,
        message: `An identity for the user "${name}" already exists in the wallet`,
      });
      return;
    }

    // Check if admin identity is in the wallet
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      res.status(400).json({
        success: false,
        message:
          "Admin identity not found in wallet. Please enroll admin first.",
      });
      return;
    }

    // Build a provider for admin identity
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register user with Fabric CA
    const secret = await ca.register(
      {
        enrollmentID: name,
        role,
        affiliation: "org1.department1",
      },
      adminUser
    );

    // Enroll the user with CA
    const enrollment = await ca.enroll({
      enrollmentID: name,
      enrollmentSecret: secret,
    });
    const privateKey = enrollment.key.toBytes();
    // Create X.509 identity
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: privateKey,
      },
      mspId: "Org1MSP",
      type: "X.509",
    };

    //  create student uuid
    const id = uuidv4();

    // get clean private key
    const publicKey = publicKeyFormat(enrollment.certificate);

    // Hash the password for MongoDB storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // save to database
    const student = new Student({
      id,
      owner_id: publicKey,
      name,
      email,
      password: hashedPassword,
      phone_number,
      role,
    });

    // if there is no  problem with register

    if (student) {
      // Save the identity to the wallet
      await wallet.put(name, x509Identity);
    }

    const saved_user = await student.save();

    // Verify JWT secret is set
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Generate JWT token that includes Fabric identity info
    const jwtToken = jwt.sign(
      {
        id: saved_user.id,
        name: saved_user.name,
        email: saved_user.email,
        role: saved_user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "72h",
      }
    );

    res.status(201).json({
      success: true,
      message: "User successfully registered with Fabric CA and application!",
      access_token: jwtToken,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Failed to register user: ${err.message}`,
    });
  }
};

const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      confirm_password,
      phone_number,
      role = "admin",
    } = req.body;

    if (password !== confirm_password) {
      res
        .status(400)
        .json({ success: false, message: "Passwords do not match" });
      return;
    }
    const ccpPath = path.resolve(
      __dirname,
      "./../../fabric-connection/connection.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get("admin");
    if (identity) {
      console.log("Admin identity already exists in the wallet");
      return;
    }

    const enrollment = await ca.enroll({
      enrollmentID: name,
      enrollmentSecret: "adminpw",
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    const id = uuidv4();

    // get clean private key
    const publicKey = publicKeyFormat(enrollment.certificate);

    // Hash the password for MongoDB storage
    const hashedPassword = await bcrypt.hash(password, 10);

    // save to database
    const admin = new Student({
      id,
      owner_id: publicKey,
      name,
      email,
      password: hashedPassword,
      phone_number,
      role,
    });

    // if there is no  problem with register

    if (admin) {
      // Save the identity to the wallet
      await wallet.put(name, x509Identity);
    }

    const saved_user = await admin.save();

    // Verify JWT secret is set
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Generate JWT token that includes Fabric identity info
    const jwtToken = jwt.sign(
      {
        id: saved_user.id,
        name: saved_user.name,
        email: saved_user.email,
        role: saved_user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "72h",
      }
    );

    res.status(201).json({
      success: true,
      message: "Admin successfully registered with Fabric CA and application!",
      access_token: jwtToken,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Failed to register user: ${err.message}`,
    });
  }
};

const loginStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) {
      res.status(404).json({ message: "student is not foundS" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Authentication Failed" });
      return;
    }

    const jwtToken = jwt.sign(
      {
        email: student.email,
        role: student.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "72h",
      }
    );

    res.status(200).json({
      message: "Login successfully",
      access_token: jwtToken,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user by token
const userProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user_email = req.user && req.user.email;
    const user = await Student.findOne({ email: user_email }).select(
      "-password"
    ); //get password out
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "User Found",
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { registerStudent, loginStudent, userProfile, registerAdmin };
