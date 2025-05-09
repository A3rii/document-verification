"use strict";

import { Request, Response } from "express";
import { connectToNetwork } from "./../../connection-api";
import { DocumentPayload } from "../types/document-types";

const postingDocument = async (
  req: Request<{}, {}, DocumentPayload>,
  res: Response
): Promise<void> => {
  try {
    const { id, issuer, issueDate, ownerId, docHash, status, metadata } =
      req.body;
    const { gateway, contract } = await connectToNetwork();

    if (
      !id ||
      !issuer ||
      !issueDate ||
      !ownerId ||
      !docHash ||
      !status ||
      !metadata
    ) {
      res.status(400).json({ message: "Missing Field Required" });
    }

    const result = await contract.submitTransaction(
      "CreateAsset",
      id,
      issuer,
      issueDate,
      ownerId,
      docHash,
      status,
      JSON.stringify(metadata)
    );

    gateway.disconnect();
    res.status(201).json({
      message: "success",
      result: JSON.parse(result.toString()),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Read All Documents
const getAllDocument = async (req: Request, res: Response): Promise<void> => {
  const { gateway, contract } = await connectToNetwork();
  try {
    const result = await contract.evaluateTransaction("GetAllAssets");
    gateway.disconnect();

    res.status(200).json({
      message: "success",
      result: JSON.parse(result.toString()),
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export { getAllDocument, postingDocument };
