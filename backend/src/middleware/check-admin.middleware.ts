import { RequestHandler } from "express";
import "dotenv/config";

const checkIsAdmin: RequestHandler = (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required. Please login.",
      });
    }

    const isAdmin = req.user && req.user.role;
    if (isAdmin === "admin") {
      next();
    } else {
      res.status(403).json({
        message: "This route has been protected",
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }
};

export { checkIsAdmin };
