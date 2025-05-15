import express from "express";
import { enrollAdmin, enrollUser } from "../controller/enroll.controller";
const router = express.Router();

router.route("/admin").post(enrollAdmin);
router.route("/user").post(enrollUser);

export default router;
