import express from "express";
import { getAllIdentities } from "../controller/student.controller";

const router = express.Router();

router.route("/").get(getAllIdentities);

export default router;
