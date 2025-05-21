"use strict";

import { Request, Response } from "express";
import { connectToNetwork } from "../connection-api";
import { DocumentPayload } from "../types/document-types";
import {
  signDocWithPrivateKey,
  encryptOwnerWithPK,
  decryptOwnerMessage,
  uploadFileToIPFS,
} from "./../exports/doc-index";
import multer from "multer";
import fs from "fs";
import { getPrivateKeyFromWallet } from "./../utils/extractSecretKeyFromWallet";
import path from "path";
const SUCCESS = 200;
const ERROR = 500;
const NOTFOUND = 404;
const BADREQUEST = 400;
// multer for file handling
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadMiddleware = upload.single("document");

const postingDocument = async (
  req: Request<{}, {}, DocumentPayload>,
  res: Response
): Promise<void> => {
  //wallet path
  const walletPath = path.resolve(__dirname, "../../wallet");
  try {
    uploadMiddleware(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: `Upload error: ${err.message}` });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const filePath = req.file.path;

      // Upload file to IPFS
      const file = await uploadFileToIPFS({
        fileData: filePath,
        metadata: {
          description: "Test upload with size validation",
          timestamp: new Date().toISOString(),
        },
      });

      const {
        id, // uuid
        issuer, // school
        issueDate, // date of upload
        // ownerId, // get the doc hash and encrypt by the owner's public key
        status, // either approved or revoked
        metadata, // additional info of user {name, class , etc.}
        docType, // either certificate or transcript
      } = req.body;

      // Validation
      if (
        !id ||
        // !ownerId ||
        !issuer ||
        !issueDate ||
        !status ||
        !metadata ||
        !docType
      ) {
        // Clean up the uploaded file
        fs.unlinkSync(filePath);
        return res
          .status(BADREQUEST)
          .json({ message: "Missing Field Required" });
      }

      // Parse metadata if it's a string
      let parsedMetadata;
      try {
        parsedMetadata =
          typeof metadata === "string" ? JSON.parse(metadata) : metadata;
      } catch (error) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Invalid metadata format" });
      }

      if (!Array.isArray(parsedMetadata)) {
        fs.unlinkSync(filePath);
        return res.status(400).json({ error: "Metadata must be an array" });
      }

      //* Get the document CID from IPFS
      const doc_cid = file.cid;
      const doc_url = file.url;
      console.log(doc_url);
      //* Encrypt the document CID with owner's public key
      const owner_hash = await encryptOwnerWithPK(
        doc_cid,
        "MIICezCCAiKgAwIBAgIUfhB+98J03HSw+J9updJcSVEn+sgwCgYIKoZIzj0EAwIw\ncDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9saW5hMQ8wDQYDVQQH\nEwZEdXJoYW0xGTAXBgNVBAoTEG9yZzEuZXhhbXBsZS5jb20xHDAaBgNVBAMTE2Nh\nLm9yZzEuZXhhbXBsZS5jb20wHhcNMjUwNTIxMTQ0OTAwWhcNMjYwNTIxMTYyNTAw\nWjBAMS4wCwYDVQQLEwRvcmcxMAsGA1UECxMEdXNlcjASBgNVBAsTC2RlcGFydG1l\nbnQxMQ4wDAYDVQQDEwVraW1seTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABHUF\n3+f77gbL9uZe63MZ4ASHh4qIWO+grsly5jkkXgblI9ovDiUsCZUQcKJigAu7B9vs\nDukXha6ccfW4mtFpm6ajgckwgcYwDgYDVR0PAQH/BAQDAgeAMAwGA1UdEwEB/wQC\nMAAwHQYDVR0OBBYEFEiNixgU7Rcuy2zso71htrQgJIf+MB8GA1UdIwQYMBaAFOLw\nBbwCRouhQNi3YrSy8snEeocyMGYGCCoDBAUGBwgBBFp7ImF0dHJzIjp7ImhmLkFm\nZmlsaWF0aW9uIjoib3JnMS5kZXBhcnRtZW50MSIsImhmLkVucm9sbG1lbnRJRCI6\nImtpbWx5IiwiaGYuVHlwZSI6InVzZXIifX0wCgYIKoZIzj0EAwIDRwAwRAIgNwhn\nzRo3NT5Nzp3mPVuNTumPu13d2yIB5kZnYyV4we4CIBeZGIcDhMqc6snJvenXfDVR\nn7ZPMQhCn+6dUbig7JJp"
      );

      //* Sign the document CID with admin's private key
      const admin_pk = getPrivateKeyFromWallet(walletPath, "admin");
      if (admin_pk === null) {
        throw new Error("Failed to retrieve identity from wallet");
      }
      const { privateKeyPem } = admin_pk;
      const doc_signature = signDocWithPrivateKey(doc_cid, privateKeyPem);

      // Connect to the blockchain network
      const { gateway, contract } = await connectToNetwork();

      // Submit transaction to the blockchain
      const result = await contract.submitTransaction(
        "CreateAsset",
        id,
        issuer,
        issueDate,
        owner_hash,
        doc_cid,
        doc_signature,
        status,
        JSON.stringify(parsedMetadata),
        docType
      );

      // Clean up - remove the temp file
      fs.unlinkSync(filePath);

      gateway.disconnect();
      if (!result || result.toString().trim() === "") {
        res.status(201).json({
          message: "Asset created successfully",
          id: id,
          doc_url: doc_url,
        });
      } else {
        res.status(201).json({
          message: "success",
          result: JSON.parse(result.toString()),
          doc_url: doc_url,
        });
      }
    });
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
