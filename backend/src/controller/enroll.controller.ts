import FabricCAServices from "fabric-ca-client";
import { Wallets, X509Identity } from "fabric-network";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";

interface EnrollAdminBody {
  enrollmentID?: string;
  enrollmentSecret?: string;
}

interface RegisterUserBody {
  enrollmentID: string;
  role?: string;
  affiliation?: string;
  attrs?: Array<{
    name: string;
    value: string;
    ecert?: boolean;
  }>;
}

const enrollAdmin = async (
  req: Request<{}, {}, EnrollAdminBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { enrollmentID = "admin", enrollmentSecret = "adminpw" } = req.body;

    // Load connection profile
    const ccpPath = path.resolve(
      __dirname,
      "./../../fabric-connection/connection.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Extract CA info
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

    // Check if the enrollment ID already exists
    const existingIdentity = await wallet.get(enrollmentID);
    if (existingIdentity) {
      res.status(400).json({
        success: false,
        message: `Identity for "${enrollmentID}" already exists in the wallet`,
      });
      return;
    }

    // Enroll admin
    const enrollment = await ca.enroll({
      enrollmentID,
      enrollmentSecret,
    });

    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };

    await wallet.put(enrollmentID, x509Identity);

    res.status(200).json({
      success: true,
      message: `Successfully enrolled admin "${enrollmentID}" and imported into wallet`,
    });
  } catch (error: any) {
    console.error("Error enrolling admin:", error);

    // Handle specific error cases
    if (error.message?.includes("fabric-ca request")) {
      res.status(401).json({
        success: false,
        message:
          "Invalid enrollment credentials. Please check enrollmentID and enrollmentSecret.",
      });
      return;
    }

    if (error.message?.includes("ECONNREFUSED")) {
      res.status(503).json({
        success: false,
        message:
          "Cannot connect to Fabric CA. Please check if the CA server is running.",
      });
      return;
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: error.message || "Failed to enroll admin",
    });
  }
};

const enrollUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      enrollmentID,
      role = "student",
      affiliation = "org1.department1",
      attrs = [],
    } = req.body;

    // Validate required fields
    if (!enrollmentID) {
      res.status(400).json({
        success: false,
        message: "enrollmentID is required",
      });
      return;
    }

    // Load the connection profile
    const ccpPath = path.resolve(
      __dirname,
      "./../../fabric-connection/connection.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Extract CA Info
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

    // Check if user already exists
    const userIdentity = await wallet.get(enrollmentID);
    if (userIdentity) {
      res.status(400).json({
        success: false,
        message: `An identity for the user "${enrollmentID}" already exists in the wallet`,
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

    // Register user with CA
    const secret = await ca.register(
      {
        affiliation,
        enrollmentID,
        role,
        attrs,
      },
      adminUser
    );

    // Enroll the user
    const enrollment = await ca.enroll({
      enrollmentID,
      enrollmentSecret: secret,
    });

    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };

    await wallet.put(enrollmentID, x509Identity);

    res.status(200).json({
      success: true,
      message: `Successfully registered and enrolled "${enrollmentID}" and imported it into the wallet`,
      credentials: {
        enrollmentID,
        affiliation,
        role,
        enrollmentSecret: secret, // In production, you might want to handle this more securely
      },
    });
  } catch (error: any) {
    console.error("Error registering user:", error);

    // Handle specific error cases
    if (error.message?.includes("Authorization failure")) {
      res.status(403).json({
        success: false,
        message:
          "Authorization failure. Admin credentials may be invalid or expired.",
      });
      return;
    }

    if (error.message?.includes("already registered")) {
      res.status(409).json({
        success: false,
        message: `User "${req.body.enrollmentID}" is already registered with the CA`,
      });
      return;
    }

    if (error.message?.includes("ECONNREFUSED")) {
      res.status(503).json({
        success: false,
        message:
          "Cannot connect to Fabric CA. Please check if the CA server is running.",
      });
      return;
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register user",
    });
  }
};

export { enrollAdmin, enrollUser };
