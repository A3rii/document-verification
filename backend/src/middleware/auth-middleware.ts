import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { StudentJwtPayload } from "../types/student-auth-types";
import "dotenv/config";

const verifyToken: RequestHandler = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Access token is missing or invalid",
      });
      return; // Return void, not the Response object
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as StudentJwtPayload;

    // Attach the decoded token to the request
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    return; 
  }
};

export { verifyToken };
