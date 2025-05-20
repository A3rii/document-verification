"use strict";

import { Request, Response } from "express";
import { connectToNetwork } from "../connection-api";
import { DocumentPayload } from "../types/document-types";

const SUCCESS = 200;
const ERROR = 500;
const NOTFOUND = 404;
const BADREQUEST = 400;

const postingDocument = async (
  req: Request<{}, {}, DocumentPayload>,
  res: Response
): Promise<void> => {
  try {
    const {
      id,
      issuer,
      issueDate,
      ownerId,
      docHash,
      docSignature,
      status,
      metadata,
      docType,
    } = req.body;

    // Validation
    if (
      !id ||
      !issuer ||
      !issueDate ||
      !ownerId ||
      !docHash ||
      !docSignature ||
      !status ||
      !metadata ||
      !docType
    ) {
      res.status(BADREQUEST).json({ message: "Missing Field Required" });
      return;
    }

    if (!Array.isArray(metadata)) {
      res.status(400).json({ error: "Metadata must be an array" });
      return;
    }

    const { gateway, contract } = await connectToNetwork();

    const result = await contract.submitTransaction(
      "CreateAsset",
      id,
      issuer,
      issueDate,
      ownerId,
      docHash,
      docSignature,
      status,
      JSON.stringify(metadata),
      docType
    );

    gateway.disconnect();

    // Check if result is empty, if so just send success message
    if (!result || result.toString().trim() === "") {
      res.status(201).json({
        message: "Asset created successfully",
        id: id,
      });
    } else {
      res.status(201).json({
        message: "success",
        result: JSON.parse(result.toString()),
      });
    }
  } catch (error: any) {
    res.status(ERROR).json({ message: error.message });
  }
};

// Read All Documents
const getAllDocument = async (req: Request, res: Response): Promise<void> => {
  const { gateway, contract } = await connectToNetwork();
  try {
    const result = await contract.evaluateTransaction("GetAllAssets");
    gateway.disconnect();

    res.status(SUCCESS).json({
      message: "success",
      result: JSON.parse(result.toString()),
    });
  } catch (err: any) {
    res.status(ERROR).json({ error: err.message });
  }
};

// getting doc by transaction id
const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  const { gateway, contract } = await connectToNetwork();
  try {
    const { docId } = req.params;
    const result = await contract.evaluateTransaction("ReadAsset", docId);
    gateway.disconnect();
    res.status(SUCCESS).json({
      message: "success",
      result: JSON.parse(result.toString()),
    });
  } catch (error: any) {
    res.status(ERROR).json({ error: error.message });
  }
};

// verify  document by its hash
const documentVerification = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { gateway, contract } = await connectToNetwork();
  try {
    const { docHash } = req.params;
    const result = await contract.evaluateTransaction(
      "AssetExistsByDocHash",
      docHash
    );
    gateway.disconnect();
    if (!result) {
      res.status(NOTFOUND).json({ message: "Document not found" });
    }

    res.status(SUCCESS).json({
      message: "success",
      result: JSON.parse(result.toString()),
    });
  } catch (error: any) {
    res.status(ERROR).json({ error: error.message });
  }
};

// get doc by  student's name
const getDocumentByStudentName = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { gateway, contract } = await connectToNetwork();

  try {
    const { name } = req.query;

    // Type guard to ensure studentName is a string
    if (typeof name !== "string") {
      res.status(BADREQUEST).json({
        error: "studentName must be provided as a string",
      });
      return;
    }

    // query by student name
    const result = await contract.evaluateTransaction(
      "QueryAssetsByStudentName",
      name
    );

    console.log(name);
    gateway.disconnect();
    res.status(SUCCESS).json({
      message: "success",
      result: JSON.parse(result.toString()),
    });
  } catch (error: any) {
    res.status(ERROR).json({ error: error.message });
  }
};

// Get doc by status
const getDocumentByStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { gateway, contract } = await connectToNetwork();

    // Change from req.params to req.query
    const { status } = req.params;

    if (typeof status !== "string") {
      res.status(BADREQUEST).json({
        error: "status must be provided as a string",
        received: status,
        type: typeof status,
      });
      return;
    }

    const result = await contract.evaluateTransaction(
      "QueryAssetsByStatus",
      status
    );

    gateway.disconnect();

    res.status(SUCCESS).json({
      message: "success",
      result: JSON.parse(result.toString()),
    });
  } catch (error: any) {
    res.status(ERROR).json({ error: error.message });
  }
};

// getting doc by ownerId

const getDocByStudentId = async (req: Request, res: Response) => {
  try {
    const { gateway, contract } = await connectToNetwork();
    const { studentId } = req.params;

    const result = await contract.evaluateTransaction(
      "QueryAssetsByOwner",
      studentId
    );
    gateway.disconnect();
    res.status(SUCCESS).json({
      message: "success",
      result: JSON.parse(result.toString()),
    });
  } catch (error: any) {
    res.status(ERROR).json({ error: error.message });
  }
};

export {
  getAllDocument,
  postingDocument,
  getDocumentById,
  documentVerification,
  getDocumentByStudentName,
  getDocumentByStatus,
  getDocByStudentId,
};
