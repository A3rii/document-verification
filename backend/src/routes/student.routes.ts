import express from "express";
import {
  getAllStudents,
  countAllStudents,
} from "../controller/student.controller";

const router = express.Router();

router.route("/").get(getAllStudents);
router.route("/count").get(countAllStudents);

export default router;
