"use strict";
/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import { Context, Contract, Info } from "fabric-contract-api";

import stringify from "json-stringify-deterministic";
import sortKeysRecursive from "sort-keys-recursive";
import { Asset, StudentMeta } from "./asset";

@Info({
  title: "AssetTransfer",
  description: "Smart contract for trading assets",
})
export class AssetTransferContract extends Contract {
  public async InitLedger(ctx: Context): Promise<void> {
    const assets: Asset[] = [
      {
        ID: "trx100001",
        IssueDate: "2025-05-01",
        Issuer: "Royal University of Phnom Penh",
        OwnerId: "stu20231001",
        DocHash:
          "a1f1d3e4c5b6a7e8d9c0f1e2b3c4d5a6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
        Status: "approved",
        MetaData: [
          {
            name: "Sokha Meas",
            sex: "Female",
            dob: "2002-08-15",
            major: "Information Technology",
            gpa: 3.85,
            overall_grade: "A",
          },
        ],
      },
      {
        ID: "trx100002",
        IssueDate: "2025-04-28",
        Issuer: "National Institute of Management",
        OwnerId: "stu20231002",
        DocHash:
          "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
        Status: "approved",
        MetaData: [
          {
            name: "Rithy Chan",
            sex: "Male",
            dob: "2001-07-22",
            major: "Business Administration",
            gpa: 3.65,
            overall_grade: "B+",
          },
        ],
      },
      {
        ID: "trx100003",
        IssueDate: "2025-04-15",
        Issuer: "Cambodia Science and Tech University",
        OwnerId: "stu20231003",
        DocHash:
          "e1f2d3c4b5a6f7e8d9c0f1e2b3c4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
        Status: "revoked",
        MetaData: [
          {
            name: "Linda Phan",
            sex: "Female",
            dob: "2000-12-01",
            major: "Civil Engineering",
            gpa: 2.9,
            overall_grade: "C",
          },
        ],
      },
    ];

    for (const asset of assets) {
      asset.docType = "certificate";
      // example of how to write to world state deterministically
      // use convetion of alphabetic order
      // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
      // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
      await ctx.stub.putState(
        asset.ID,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      );
      console.info(`Asset ${asset.ID} initialized`);
    }
  }

  // GetAllAssets returns all assets found in the world state.

  public async GetAllAssets(ctx: Context): Promise<string> {
    const allResults = [];
    const iterator = await ctx.stub.getStateByRange("", "");
    let result = await iterator.next();
    while (!result.done) {
      const strValue = Buffer.from(result.value.value.toString()).toString(
        "utf8"
      );
      let record;
      try {
        record = JSON.parse(strValue) as Asset;
      } catch (err) {
        console.log(err);
        record = strValue;
      }
      allResults.push(record); // Add all records without filtering
      result = await iterator.next();
    }
    return JSON.stringify(allResults);
  }

  // CreateAsset issues a new asset to the world state with given details.
  public async CreateAsset(
    ctx: Context,
    id: string,
    issuer: string,
    issue_date: string,
    owner_id: string,
    doc_hash: string,
    status: string,
    metadata_json: string
  ): Promise<void> {
    const exists = await this.AssetExists(ctx, id);
    if (exists) {
      throw new Error(`The asset ${id} already exists`);
    }

    // Parse the metadata from JSON string and ensure it's in an array
    const metadataObj = JSON.parse(metadata_json) as StudentMeta;

    // If metadata is not already an array, put it in an array
    const metadataArray = Array.isArray(metadataObj)
      ? metadataObj
      : [metadataObj];

    const asset = {
      ID: id,
      Issuer: issuer,
      IssueDate: issue_date,
      OwnerId: owner_id,
      DocHash: doc_hash,
      Status: status || "approved",
      MetaData: metadataArray,
    };

    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(asset)))
    );
  }

  // verification function
  public async VerifyAsset(
    ctx: Context,
    id: string,
    docHash: string
  ): Promise<boolean> {
    // Check if asset exists
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    // Get the asset from the ledger
    const assetData = await ctx.stub.getState(id);
    if (assetData.length === 0) {
      throw new Error(`Failed to get asset: ${id}`);
    }

    // Deserialize the asset data from buffer to JSON object
    const asset = JSON.parse(assetData.toString()) as Asset;

    // Compare the input appraised value with the value from the ledger
    if (docHash === asset.DocHash) {
      return true;
    } else {
      return false;
    }
  }

  // ReadAsset returns the asset stored in the world state with given id.
  public async ReadAsset(ctx: Context, id: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(id);
    if (assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  // UpdateAsset updates an existing asset in the world state with provided parameters.
  public async UpdateAsset(
    ctx: Context,
    id: string,
    issuer: string,
    issue_date: string,
    owner_id: string,
    doc_hash: string,
    status: string,
    metadata_json: string
  ): Promise<void> {
    // Check if the asset exists
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    // Parse the metadata from JSON string
    let metadataObj;
    try {
      metadataObj = JSON.parse(metadata_json) as Asset;
    } catch (error) {
      throw new Error(
        `Invalid metadata JSON format: ${(error as Error).message}`
      );
    }

    // Ensure metadata is in an array format
    const metadataArray = Array.isArray(metadataObj)
      ? metadataObj
      : [metadataObj];

    // Create the asset object with the updated values
    const asset = {
      ID: id,
      Issuer: issuer,
      IssueDate: issue_date,
      OwnerId: owner_id,
      DocHash: doc_hash,
      Status: status || "approved",
      MetaData: metadataArray,
    };

    // Get the existing asset to merge only the changed fields
    const assetBuffer = await ctx.stub.getState(id);
    const existingAsset = JSON.parse(assetBuffer.toString()) as Asset;

    // Create updated asset by merging the existing asset with new values
    const updatedAsset = {
      ...existingAsset,
      ...asset,
    };

    // Update the asset in the ledger
    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(updatedAsset)))
    );
  }

  // DeleteAsset deletes an given asset from the world state.
  public async DeleteAsset(ctx: Context, id: string): Promise<void> {
    const exists = await this.AssetExists(ctx, id);
    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return ctx.stub.deleteState(id);
  }

  public async AssetExists(ctx: Context, id: string): Promise<boolean> {
    const assetJSON = await ctx.stub.getState(id);
    return assetJSON.length > 0;
  }

  // Revoke Doc
  public async RevokeAsset(ctx: Context, doc_hash: string): Promise<void> {
    // Check if the document exists by its hash
    const assetJSON = await ctx.stub.getState(doc_hash);
    if (assetJSON.length === 0) {
      throw new Error(`The document with hash ${doc_hash} is not found`);
    }

    // Parse the existing asset
    const existingAsset = JSON.parse(assetJSON.toString()) as Asset;

    // Update only the status while preserving all other fields
    existingAsset.Status = "Revoked";

    // Update the asset in the ledger
    await ctx.stub.putState(
      doc_hash,
      Buffer.from(stringify(sortKeysRecursive(existingAsset)))
    );
  }

  public async GetDocByOwner(ctx: Context, owner_id: string) {
    const assetJSON = await ctx.stub.getState(owner_id);

    if (assetJSON.length === 0) {
      throw new Error(`User with ID ${owner_id} is not found`);
    }
    return assetJSON.toString();
  }
}
