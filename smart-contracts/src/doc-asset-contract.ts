/*
 * SPDX-License-Identifier: Apache-2.0
 */

// ====CHAINCODE EXECUTION SAMPLES (CLI) ==================

// ==== Invoke assets ====
// peer chaincode invoke -C CHANNEL_NAME -n asset_transfer -c '{"Args":["CreateAsset","asset1","blue","35","Tom","100"]}'
// peer chaincode invoke -C CHANNEL_NAME -n asset_transfer -c '{"Args":["CreateAsset","asset2","red","50","Tom","150"]}'
// peer chaincode invoke -C CHANNEL_NAME -n asset_transfer -c '{"Args":["CreateAsset","asset3","blue","70","Tom","200"]}'
// peer chaincode invoke -C CHANNEL_NAME -n asset_transfer -c '{"Args":["TransferAsset","asset2","jerry"]}'
// peer chaincode invoke -C CHANNEL_NAME -n asset_transfer -c '{"Args":["TransferAssetByColor","blue","jerry"]}'
// peer chaincode invoke -C CHANNEL_NAME -n asset_transfer -c '{"Args":["DeleteAsset","asset1"]}'

// ==== Query assets ====
// peer chaincode query -C CHANNEL_NAME -n asset_transfer -c '{"Args":["ReadAsset","asset1"]}'
// peer chaincode query -C CHANNEL_NAME -n asset_transfer -c '{"Args":["GetAssetsByRange","asset1","asset3"]}'
// peer chaincode query -C CHANNEL_NAME -n asset_transfer -c '{"Args":["GetAssetHistory","asset1"]}'

// Rich Query (Only supported if CouchDB is used as state database):
// peer chaincode query -C CHANNEL_NAME -n asset_transfer -c '{"Args":["QueryAssetsByOwner","Tom"]}' output issue
// peer chaincode query -C CHANNEL_NAME -n asset_transfer -c '{"Args":["QueryAssets","{\"selector\":{\"owner\":\"Tom\"}}"]}'

// Rich Query with Pagination (Only supported if CouchDB is used as state database):
// peer chaincode query -C CHANNEL_NAME -n asset_transfer -c '{"Args":["QueryAssetsWithPagination","{\"selector\":{\"owner\":\"Tom\"}}","3",""]}'

// INDEXES TO SUPPORT COUCHDB RICH QUERIES
//
// Indexes in CouchDB are required in order to make JSON queries efficient and are required for
// any JSON query with a sort. Indexes may be packaged alongside
// chaincode in a META-INF/statedb/couchdb/indexes directory. Each index must be defined in its own
// text file with extension *.json with the index definition formatted in JSON following the
// CouchDB index JSON syntax as documented at:
// http://docs.couchdb.org/en/2.3.1/api/database/find.html#db-index
//
// This asset transfer ledger example chaincode demonstrates a packaged
// index which you can find in META-INF/statedb/couchdb/indexes/indexOwner.json.
//
// If you have access to the your peer's CouchDB state database in a development environment,
// you may want to iteratively test various indexes in support of your chaincode queries.  You
// can use the CouchDB Fauxton interface or a command line curl utility to create and update
// indexes. Then once you finalize an index, include the index definition alongside your
// chaincode in the META-INF/statedb/couchdb/indexes directory, for packaging and deployment
// to managed environments.
//
// In the examples below you can find index definitions that support asset transfer ledger
// chaincode queries, along with the syntax that you can use in development environments
// to create the indexes in the CouchDB Fauxton interface or a curl command line utility.
//

// Index for docType, owner.
//
// Example curl command line to define index in the CouchDB channel_chaincode database
// curl -i -X POST -H "Content-Type: application/json" -d "{\"index\":{\"fields\":[\"docType\",\"owner\"]},\"name\":\"indexOwner\",\"ddoc\":\"indexOwnerDoc\",\"type\":\"json\"}" http://hostname:port/myc1_assets/_index
//

// Index for docType, owner, size (descending order).
//
// Example curl command line to define index in the CouchDB channel_chaincode database
// curl -i -X POST -H "Content-Type: application/json" -d "{\"index\":{\"fields\":[{\"size\":\"desc\"},{\"docType\":\"desc\"},{\"owner\":\"desc\"}]},\"ddoc\":\"indexSizeSortDoc\", \"name\":\"indexSizeSortDesc\",\"type\":\"json\"}" http://hostname:port/myc1_assets/_index

// Rich Query with index design doc and index name specified (Only supported if CouchDB is used as state database):
//   peer chaincode query -C CHANNEL_NAME -n ledger -c '{"Args":["QueryAssets","{\"selector\":{\"docType\":\"asset\",\"owner\":\"Tom\"}, \"use_index\":[\"_design/indexOwnerDoc\", \"indexOwner\"]}"]}'

// Rich Query with index design doc specified only (Only supported if CouchDB is used as state database):
//   peer chaincode query -C CHANNEL_NAME -n ledger -c '{"Args":["QueryAssets","{\"selector\":{\"docType\":{\"$eq\":\"asset\"},\"owner\":{\"$eq\":\"Tom\"},\"size\":{\"$gt\":0}},\"fields\":[\"docType\",\"owner\",\"size\"],\"sort\":[{\"size\":\"desc\"}],\"use_index\":\"_design/indexSizeSortDoc\"}"]}'

import {
  Context,
  Contract,
  Info,
  Returns,
  Transaction,
} from "fabric-contract-api";
import stringify from "json-stringify-deterministic";
import sortKeysRecursive from "sort-keys-recursive";
import { Asset, StudentMeta, GeneralSubjects } from "./asset";

@Info({
  title: "AssetTransfer",
  description: "Smart Contract for asset transfer ledger sample",
})
export class AssetTransferContract extends Contract {
  @Transaction()
  public async InitLedger(ctx: Context): Promise<void> {
    const assets: Asset[] = [
      {
        ID: "trx100001",
        IssueDate: "2025-05-01",
        Issuer: "Royal University of Phnom Penh",
        OwnerId: "stu20231001",
        DocHash:
          "a1f1d3e4c5b6a7e8d9c0f1e2b3c4d5a6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
        DocSignature:
          "3045022100c7d8e9fa0b1c2d3e4f5a6b7c8d9eaf0b1c2d3e4f5a6b7c8d9eaf0b1c2d3e4f022067890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345",
        Status: "approved",
        Doc_URL:
          "https://8920485d1a083bb2d3854bbe524817d7.ipfscdn.io/ipfs/bafybeiceuovridggjanp2imgcvihe4hfftmmgricm6jfz4wkpmh6ceuarq/52a8985b4fa6350cbb2e869b89abd4e0",
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
        GeneralSubject: [],
      },
    ];

    for (const asset of assets) {
      asset.docType = "certificate";

      await ctx.stub.putState(
        asset.ID,
        Buffer.from(stringify(sortKeysRecursive(asset)))
      );
      console.info(`Asset ${asset.ID} initialized`);
    }
  }
  // In the smart contract, modify CreateAsset to return the created asset
  @Transaction()
  public async CreateAsset(
    ctx: Context,
    id: string,
    issuer: string,
    issue_date: string,
    owner_id: string,
    doc_hash: string,
    doc_url: string,
    doc_signature: string,
    status: string,
    metadata_json: string,
    general_subject: string,
    docType: string
  ): Promise<string> {
    // Change return type to string
    const exists = await this.AssetExistsByDocHash(ctx, doc_hash);
    if (exists) {
      throw new Error(`The asset ${id} already exists`);
    }

    // Parse the metadata from JSON string and ensure it's in an array
    const metadataObj = JSON.parse(metadata_json) as StudentMeta;
    const generalSubjectObj = JSON.parse(general_subject) as GeneralSubjects;

    // If metadata is not already an array, put it in an array
    const metadataArray = Array.isArray(metadataObj)
      ? metadataObj
      : [metadataObj];

    const generalSubjectArray = Array.isArray(generalSubjectObj)
      ? generalSubjectObj
      : [generalSubjectObj];

    const asset = {
      ID: id,
      Issuer: issuer,
      IssueDate: issue_date,
      OwnerId: owner_id,
      DocHash: doc_hash,
      Doc_URL: doc_url,
      DocSignature: doc_signature,
      Status: status || "approved",
      MetaData: metadataArray,
      GeneralSubject: generalSubjectArray,
      docType: docType,
    };

    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(asset)))
    );

    // Return the created asset as a JSON string
    return stringify(sortKeysRecursive(asset));
  }

  //
  @Transaction(false)
  @Returns("string")
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

  @Transaction(false)
  public async QueryAssetsByStatus(
    ctx: Context,
    status: string,
    docType?: string
  ): Promise<string> {
    // Use the exact same pattern as AssetExistsByDocHash
    const queryString = JSON.stringify({
      selector: {
        docType: docType,
        Status: status,
      },
    });

    const iterator = await ctx.stub.getQueryResult(queryString);
    const allResults = [];

    try {
      let result = await iterator.next();
      while (!result.done) {
        const strValue = Buffer.from(result.value.value.toString()).toString(
          "utf8"
        );

        try {
          const record = JSON.parse(strValue) as Asset;
          allResults.push(record);
        } catch (err) {
          console.log(err);
          allResults.push(strValue);
        }

        result = await iterator.next();
      }
    } finally {
      await iterator.close();
    }

    return JSON.stringify(allResults);
  }

  @Transaction(false)
  public async QueryAssetsByStudentName(
    ctx: Context,
    name: string
  ): Promise<string> {
    // Option 1: Query using a more general approach
    const queryString = JSON.stringify({
      selector: {
        MetaData: {
          $elemMatch: {
            name: name,
          },
        },
        // Status: 'approved',
      },
    });

    const allResults = [];
    const iterator = await ctx.stub.getQueryResult(queryString);

    try {
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
        allResults.push(record);
        result = await iterator.next();
      }
    } finally {
      await iterator.close();
    }

    return JSON.stringify(allResults);
  }

  // Query by trx id
  @Transaction(false)
  public async ReadAsset(ctx: Context, id: string): Promise<string> {
    const assetJSON = await ctx.stub.getState(id);
    if (assetJSON.length === 0) {
      throw new Error(`The asset ${id} does not exist`);
    }
    return assetJSON.toString();
  }

  // verifying  process
  @Transaction(false)
  @Returns("string")
  public async AssetExistsByDocHash(
    ctx: Context,
    doc_hash: string
  ): Promise<boolean> {
    // Validate input
    if (!doc_hash || doc_hash.trim() === "") {
      return false;
    }

    const queryString = JSON.stringify({
      selector: {
        DocHash: doc_hash,
      },
    });

    // Execute the query
    const iterator = await ctx.stub.getQueryResult(queryString);

    try {
      // Check if any result exists
      const result = await iterator.next();
      return !result.done;
    } finally {
      await iterator.close();
    }
  }

  // verifying the doc by its hash
  @Transaction(false)
  @Returns("string")
  public async VerifyAsset(ctx: Context, doc_hash: string): Promise<string> {
    const queryString = JSON.stringify({
      selector: {
        DocHash: doc_hash,
      },
    });

    // Execute the query
    const iterator = await ctx.stub.getQueryResult(queryString);

    try {
      // Get the first result
      const result = await iterator.next();

      if (result.done) {
        // No asset found
        return JSON.stringify({
          exists: false,
          data: null,
        });
      }

      const asset = JSON.parse(result.value.value.toString()) as Asset;

      // Check if there are more results (there shouldn't be for a unique doc_hash)
      const nextResult = await iterator.next();
      if (!nextResult.done) {
        // Multiple assets found with same doc_hash - this indicates a data integrity issue
        throw new Error(`Multiple assets found with doc_hash: ${doc_hash}`);
      }

      return JSON.stringify({
        exists: true,
        data: asset,
      });
    } finally {
      await iterator.close();
    }
  }

  // Query by owner
  @Transaction(false)
  public async QueryAssetsByOwner(
    ctx: Context,
    ownerId: string
  ): Promise<string> {
    const queryString = JSON.stringify({
      selector: {
        OwnerId: ownerId,
      },
    });
    return await this.getQueryResultForQueryString(ctx, queryString);
  }

  // Revoked Document In Case the document is fault
  @Transaction()
  @Returns("string")
  public async RevokedAsset(ctx: Context, id: string): Promise<string> {
    const exists = await this.ReadAsset(ctx, id);

    if (!exists) {
      throw new Error(`The asset ${id} does not exist`);
    }

    const assetBytes = await ctx.stub.getState(id);
    if (assetBytes.length === 0) {
      throw new Error(`Asset ${id} exists but contains no data`);
    }

    const assetString = assetBytes.toString();
    if (!assetString.trim()) {
      throw new Error(`Asset ${id} contains empty string data`);
    }

    let currentAsset: Asset;
    try {
      currentAsset = JSON.parse(assetString) as Asset;
    } catch (parseError) {
      console.error(`JSON parse error for asset ${id}:`, parseError);
      console.error(`Raw data that failed to parse:`, assetString);
      throw new Error(`Invalid JSON data in asset ${id}`);
    }

    if (currentAsset.Status === "revoked") {
      throw new Error(`Asset ${id} is already revoked`);
    }

    // Update the asset with revoked status
    const updatedAsset = {
      ...currentAsset,
      Status: "revoked",
    };

    // Store the updated asset
    await ctx.stub.putState(
      id,
      Buffer.from(stringify(sortKeysRecursive(updatedAsset)))
    );

    return JSON.stringify(updatedAsset);
  }

  // ------Helper function------- //
  private async getQueryResultForQueryString(
    ctx: Context,
    queryString: string
  ): Promise<string> {
    const iterator = await ctx.stub.getQueryResult(queryString);
    const allResults = [];
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
      allResults.push(record);
      result = await iterator.next();
    }

    await iterator.close();
    return JSON.stringify(allResults);
  }
}
