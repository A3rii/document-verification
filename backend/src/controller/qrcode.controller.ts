import QrCode from "./../models/qrcode.model";
import { Request, Response } from "express";
import mongoose from "mongoose";

// get by owner ID
const getQrByOwnerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      res.status(400).json({
        success: false,
        message: "Invalid student ID format",
      });
      return;
    }

    const qrCodes = await QrCode.findOne({ studentId }).populate(
      "studentId",
      "name"
    );

    if (!qrCodes) {
      res.status(404).json({
        success: false,
        message: "No QR codes found for this student",
        result: [],
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "QR codes retrieved successfully",
      result: qrCodes,
    });
  } catch (err: any) {
    res.status(500).json({
      message: false,
      error: err.message,
    });
  }
};

const updateDocumentStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { docHash, status } = req.body;
    const updateDocumentStatus = await QrCode.findOne({ docHash });

    if (!updateDocumentStatus) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
      return;
    }
    updateDocumentStatus.isPublic = status;
    await updateDocumentStatus.save();

    res.status(200).json({
      message: "Document Status Succuessfully",
      result: updateDocumentStatus,
    });
  } catch (err: any) {
    res.status(500).json({
      message: false,
      error: err.message,
    });
  }
};

export { getQrByOwnerId, updateDocumentStatus };
