import express from "express";
import {
  getQrByOwnerId,
  updateDocumentStatus,
} from "./../controller/qrcode.controller";

const router = express.Router();

router.route("/:studentId").get(getQrByOwnerId);

router.route("/status").put(updateDocumentStatus);

export default router;
