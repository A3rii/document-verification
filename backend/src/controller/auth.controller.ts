import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Student from "../models/student.model";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

const registerStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { owner_id, name, email, password, confirm_password, phone_number } =
      req.body;

    if (password !== confirm_password) {
      res.status(400).json({ message: "Passwords do not match" });

      return;
    }

    // Verify if the email is already used
    const existing_user = await Student.findOne({ email });
    if (existing_user) {
      res.status(403).json({ message: "Email already used" });
      return;
    }

    // Generate userId
    const id = uuidv4();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      id,
      owner_id,
      name,
      email,
      password: hashedPassword,
      phone_number,
    });

    const saved_user = await student.save();

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // Generate JWT token after the user is saved
    const jwtToken = jwt.sign(
      {
        name: saved_user.name,
        email: saved_user.email,
        role: saved_user.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "72h",
      }
    );
    res.status(201).json({
      message: "User successfully Registered!",
      access_token: jwtToken,
    });
  } catch (err: any) {
    throw new Error(err.message);
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
  } catch (err: any) {
    throw new Error(err.message);
  }
};

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
export { registerStudent, loginStudent, userProfile };
