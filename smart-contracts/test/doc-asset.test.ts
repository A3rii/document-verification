"use strict";
import { ChaincodeStub, ClientIdentity } from "fabric-shim";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import { AssetTransferContract } from "./../src/doc-asset-contract";
import { Context } from "fabric-contract-api";
import { Asset } from "../src/asset";

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

describe("AssetTransferContract", () => {
  let contract: AssetTransferContract;
  let ctx: Context;
  let stub: sinon.SinonStubbedInstance<ChaincodeStub>;
  let clientIdentity: sinon.SinonStubbedInstance<ClientIdentity>;

  beforeEach(() => {
    contract = new AssetTransferContract();
    stub = sinon.createStubInstance(ChaincodeStub);
    clientIdentity = sinon.createStubInstance(ClientIdentity);
    ctx = new Context();
    ctx.stub = stub as any;
    ctx.clientIdentity = clientIdentity as any;
  });

  describe("#ReadAsset", () => {
    it("should return an asset", async () => {
      // Create a single asset object
      const asset: Asset = {
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
      };

      // Mock getState to return the asset when requested
      stub.getState.resolves(Buffer.from(JSON.stringify(asset)));

      // Call readAsset with the correct ID
      const result = await contract.ReadAsset(ctx, "trx100001");

      // Verify the result
      expect(result).to.equal(JSON.stringify(asset));

      // Verify that getState was called with the correct parameters
      expect(stub.getState).to.have.been.calledWith("trx100001");
    });

    it("should throw error for non-existent asset", async () => {
      // Use chai-as-promised for async error testing
      await expect(contract.ReadAsset(ctx, "asset999")).to.be.rejectedWith(
        "The asset asset999 does not exist"
      );

      // Verify that getState was called
      expect(stub.getState).to.have.been.calledWith("asset999");
    });
  });
});
