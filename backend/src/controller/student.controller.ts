
import Student from "../models/student.model";
import { Request, Response, NextFunction } from "express";



// get all user 
const getAllStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await Student.find();
    res.status(200).json({
      users,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllStudents };
