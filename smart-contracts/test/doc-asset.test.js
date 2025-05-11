"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fabric_shim_1 = require("fabric-shim");
const chai_1 = __importStar(require("chai"));
const chai_as_promised_1 = __importDefault(require("chai-as-promised"));
const sinon_1 = __importDefault(require("sinon"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
const doc_asset_contract_1 = require("./../src/doc-asset-contract");
const fabric_contract_api_1 = require("fabric-contract-api");
chai_1.default.should();
chai_1.default.use(chai_as_promised_1.default);
chai_1.default.use(sinon_chai_1.default);
describe("AssetTransferContract", () => {
    let contract;
    let ctx;
    let stub;
    let clientIdentity;
    beforeEach(() => {
        contract = new doc_asset_contract_1.AssetTransferContract();
        stub = sinon_1.default.createStubInstance(fabric_shim_1.ChaincodeStub);
        clientIdentity = sinon_1.default.createStubInstance(fabric_shim_1.ClientIdentity);
        ctx = new fabric_contract_api_1.Context();
        ctx.stub = stub;
        ctx.clientIdentity = clientIdentity;
    });
    describe("#ReadAsset", () => {
        it("should return an asset", () => __awaiter(void 0, void 0, void 0, function* () {
            // Create a single asset object
            const asset = {
                ID: "trx100001",
                IssueDate: "2025-05-01",
                Issuer: "Royal University of Phnom Penh",
                OwnerId: "stu20231001",
                DocHash: "a1f1d3e4c5b6a7e8d9c0f1e2b3c4d5a6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2",
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
            const result = yield contract.ReadAsset(ctx, "trx100001");
            // Verify the result
            (0, chai_1.expect)(result).to.equal(JSON.stringify(asset));
            // Verify that getState was called with the correct parameters
            (0, chai_1.expect)(stub.getState).to.have.been.calledWith("trx100001");
        }));
        it("should throw error for non-existent asset", () => __awaiter(void 0, void 0, void 0, function* () {
            // Use chai-as-promised for async error testing
            yield (0, chai_1.expect)(contract.ReadAsset(ctx, "asset999")).to.be.rejectedWith("The asset asset999 does not exist");
            // Verify that getState was called
            (0, chai_1.expect)(stub.getState).to.have.been.calledWith("asset999");
        }));
    });
});
