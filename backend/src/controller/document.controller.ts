"use strict";

import { Request, Response } from "express";
import { connectToNetwork } from "../connection-api";
import { DocumentPayload } from "../types/document-types";
import {
  signDocWithPrivateKey,
  encryptOwnerWithPK,
  decryptOwnerMessage,
  uploadFileToIPFS,
  verifiSignature,
} from "./../exports/doc-index";
import multer from "multer";
import fs from "fs";
import { getKeyFromWallet } from "../utils/extractKeyFromWallet";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
        issuer, // school
        issueDate, // date of upload
        ownerId, // get the doc hash and encrypt by the owner's public key
        status, // either approved or revoked
        metadata, // additional info of user {name, class , etc.}
        docType, // either certificate or transcript
      } = req.body;

      // Validation
      if (
        !ownerId ||
        !issuer ||
        !issueDate ||
        !status ||
        !metadata ||
        !docType
      ) {
        // Clean up the uploaded file
        fs.unlinkSync(filePath);
        return res.status(BADREQUEST).json({
          message: `Missing Field Required ${ownerId} ${issuer}
            ${issueDate}
            ${status}
            ${metadata}
            ${docType}
            
            `,
        });
      }

      const id = uuidv4();

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

      //* Sign document CID with owner's secret key
      const student_pk = getKeyFromWallet(walletPath, ownerId);
      if (student_pk === null) {
        throw new Error("Failed to retrieve identity from student wallet");
      }

      const studentPrivateKey = student_pk.privateKeyPem;

      const owner_hash = signDocWithPrivateKey(doc_cid, studentPrivateKey);

      //* Sign the document CID with admin's secret key
      const admin_pk = getKeyFromWallet(walletPath, "rupp");

      if (admin_pk === null) {
        throw new Error("Failed to retrieve identity from admin  wallet");
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
        doc_url,
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
        });
      } else {
        res.status(201).json({
          message: "success",
          result: JSON.parse(result.toString()),
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
  const walletPath = path.resolve(__dirname, "../../wallet");
  try {
    const { docHash } = req.params;
    const result = await contract.evaluateTransaction("VerifyAsset", docHash);
    const parseResult = JSON.parse(result.toString());

    if (!parseResult.exists) {
      res.status(NOTFOUND).json({ message: "Document not found" });
    }

    // getting data from the document
    const doc_result = parseResult.data;

    // getting private key from owner wallet
    const ownerWallet = getKeyFromWallet(
      walletPath,
      doc_result?.MetaData?.[0].name // owner wallet's name
    );

    // check type safety
    if (ownerWallet === null) {
      throw new Error("Failed to retrieve identity from wallet");
    }

    //getting identity of the owner
    const ownerCertificate = ownerWallet.certificatePem;

    const adminWallet = getKeyFromWallet(
      walletPath,
      "rupp" // admin wallet's name
    );
    if (adminWallet === null) {
      throw new Error("Failed to retrieve identity from wallet");
    }
    const { certificatePem } = adminWallet;

    // if the verify the doc is true which mean the doc comes from the rupp

    gateway.disconnect();
    if (
      verifiSignature(
        doc_result.DocHash,
        doc_result.OwnerId,
        ownerCertificate
      ) &&
      verifiSignature(
        doc_result.DocHash,
        doc_result.DocSignature,
        certificatePem
      )
    ) {
      res.status(SUCCESS).json({
        message: "Document is valid",
        result: parseResult.data,
      });
    } else {
      res.status(200).json({
        message: "Document is counterfeit",
      });
    }
  } catch (error: any) {
    gateway.disconnect();
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
    const { studentName } = req.params;

    // Type guard to ensure studentName is a string
    if (typeof studentName !== "string") {
      res.status(BADREQUEST).json({
        error: "studentName must be provided as a string",
      });
      return;
    }

    // query by student name
    const result = await contract.evaluateTransaction(
      "QueryAssetsByStudentName",
      studentName
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
      status,
      "certificate"
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
    const { ownerId } = req.params;

    const result = await contract.evaluateTransaction(
      "QueryAssetsByOwner",
      ownerId
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
