import express from "express";
import {
  registerStudent,
  loginStudent,
  userProfile,
} from "../controller/auth.controller";
import { verifyToken } from "./../middleware/auth-middleware";
const router = express.Router();

router.route("/register").post(registerStudent);
router.route("/login").post(loginStudent);
router.route("/profile").get(verifyToken, userProfile);

export default router;
