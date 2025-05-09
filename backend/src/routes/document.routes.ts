import express from "express";
import {
  getAllDocument,
  postingDocument,
} from "../controller/document.controller";

const router = express.Router();

router.route("/document").get(getAllDocument).post(postingDocument);

export default router;
