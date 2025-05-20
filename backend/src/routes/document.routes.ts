import express from "express";
import {
  getAllDocument,
  postingDocument,
  getDocumentById,
  documentVerification,
  getDocumentByStudentName,
  getDocumentByStatus,
  getDocByStudentId,
} from "../controller/document.controller";

const router = express.Router();

/** Document API */

// post and get doc
router.route("/").get(getAllDocument).post(postingDocument);

//get doc by id
router.route("/:docId").get(getDocumentById);

// verify doc
router.route("/verify/:docHash").get(documentVerification);

// query by student name
//TODO: error
router.route("/student").get(getDocumentByStudentName);

// Get Doc By student id
router.route("/student/:studentId").get(getDocByStudentId);

// query doc by status

router.route("/status/:status").get(getDocumentByStatus);

export default router;
