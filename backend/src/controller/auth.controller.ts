import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Student from "../models/student.model";
import { v4 as uuidv4 } from "uuid";
import { Request, Response } from "express";

const registerStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, confirm_password, phone_number } = req.body;

    if (password !== confirm_password) {
      res.status(400).json({ message: "Passwords do not match" });
    }

    // Verify if the email is already used
    const existing_user = await Student.findOne({ email });
    if (existing_user) {
      res.status(403).json({ message: "Email already used" });
    }

    // Generate userId
    const userId = uuidv4();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      userId,
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
        id: saved_user.id,
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
      success: true,
      accessToken: jwtToken,
      user: saved_user,
    });
  } catch (err: any) {
    throw new Error(err.message);
  }
};

export { registerStudent };
