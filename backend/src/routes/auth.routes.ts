import express from "express";
import { registerStudent } from "../controller/auth.controller";
const router = express.Router();

router.route("/register").post(registerStudent);

export default router;
