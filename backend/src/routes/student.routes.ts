import express from "express";
import { getAllStudents } from "../controller/student.controller";

const router = express.Router();

router.route("/").get(getAllStudents);

export default router;
