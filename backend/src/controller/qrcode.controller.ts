import QrCode from "./../models/qrcode.model";
import { Request, Response } from "express";
import mongoose from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

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
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable is not defined");
    }

    if (!updateDocumentStatus) {
      res.status(404).json({
        success: false,
        message: "Document not found",
      });
      return;
    }

    updateDocumentStatus.isPublic = status;

    if (status) {
      // Create temp password when making public
      const temporaryPassword = crypto
        .randomBytes(6)
        .toString("hex")
        .toUpperCase();

      // Set expiration (24 hours from now)
      const passwordExpiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);

      const accessToken = jwt.sign(
        {
          qrCodeId: updateDocumentStatus._id,
          type: "public_access",
          tempPassword: temporaryPassword,
        },
        JWT_SECRET,
        { expiresIn: "12h" }
      );

      // Save temporary password data to document
      updateDocumentStatus.tempPassword = temporaryPassword;
      updateDocumentStatus.passwordExpiresAt = passwordExpiresAt;
      updateDocumentStatus.accessToken = accessToken;
    } else {
      // Clear temporary password data when making private
      updateDocumentStatus.tempPassword = "";
      updateDocumentStatus.passwordExpiresAt = new Date();
      updateDocumentStatus.accessToken = "";
    }

    await updateDocumentStatus.save();

    res.status(200).json({
      message: "Document Status Updated Successfully",
      result: updateDocumentStatus,
      ...(status && {
        tempPassword: updateDocumentStatus.tempPassword,
        expiresAt: updateDocumentStatus.passwordExpiresAt,
      }),
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export { getQrByOwnerId, updateDocumentStatus };
