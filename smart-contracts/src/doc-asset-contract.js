"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTransferContract = void 0;
/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
const fabric_contract_api_1 = require("fabric-contract-api");
const json_stringify_deterministic_1 = __importDefault(require("json-stringify-deterministic"));
const sort_keys_recursive_1 = __importDefault(require("sort-keys-recursive"));
let AssetTransferContract = (() => {
    let _classDecorators = [(0, fabric_contract_api_1.Info)({
            title: "AssetTransfer",
            description: "Smart contract for trading assets",
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = fabric_contract_api_1.Contract;
    var AssetTransferContract = _classThis = class extends _classSuper {
        InitLedger(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const assets = [
                    {
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
                    },
                    {
                        ID: "trx100002",
                        IssueDate: "2025-04-28",
                        Issuer: "National Institute of Management",
                        OwnerId: "stu20231002",
                        DocHash: "d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4",
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
                        DocHash: "e1f2d3c4b5a6f7e8d9c0f1e2b3c4d5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2",
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
                    yield ctx.stub.putState(asset.ID, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(asset))));
                    console.info(`Asset ${asset.ID} initialized`);
                }
            });
        }
        // GetAllAssets returns all assets found in the world state.
        GetAllAssets(ctx) {
            return __awaiter(this, void 0, void 0, function* () {
                const allResults = [];
                const iterator = yield ctx.stub.getStateByRange("", "");
                let result = yield iterator.next();
                while (!result.done) {
                    const strValue = Buffer.from(result.value.value.toString()).toString("utf8");
                    let record;
                    try {
                        record = JSON.parse(strValue);
                    }
                    catch (err) {
                        console.log(err);
                        record = strValue;
                    }
                    allResults.push(record); // Add all records without filtering
                    result = yield iterator.next();
                }
                return JSON.stringify(allResults);
            });
        }
        // CreateAsset issues a new asset to the world state with given details.
        CreateAsset(ctx, id, issuer, issue_date, owner_id, doc_hash, status, metadata_json) {
            return __awaiter(this, void 0, void 0, function* () {
                const exists = yield this.AssetExists(ctx, id);
                if (exists) {
                    throw new Error(`The asset ${id} already exists`);
                }
                // Parse the metadata from JSON string and ensure it's in an array
                const metadataObj = JSON.parse(metadata_json);
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
                yield ctx.stub.putState(id, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(asset))));
            });
        }
        // verification function
        VerifyAsset(ctx, id, docHash) {
            return __awaiter(this, void 0, void 0, function* () {
                // Check if asset exists
                const exists = yield this.AssetExists(ctx, id);
                if (!exists) {
                    throw new Error(`The asset ${id} does not exist`);
                }
                // Get the asset from the ledger
                const assetData = yield ctx.stub.getState(id);
                if (assetData.length === 0) {
                    throw new Error(`Failed to get asset: ${id}`);
                }
                // Deserialize the asset data from buffer to JSON object
                const asset = JSON.parse(assetData.toString());
                // Compare the input appraised value with the value from the ledger
                if (docHash === asset.DocHash) {
                    return true;
                }
                else {
                    return false;
                }
            });
        }
        // ReadAsset returns the asset stored in the world state with given id.
        ReadAsset(ctx, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const assetJSON = yield ctx.stub.getState(id);
                if (assetJSON.length === 0) {
                    throw new Error(`The asset ${id} does not exist`);
                }
                return assetJSON.toString();
            });
        }
        // UpdateAsset updates an existing asset in the world state with provided parameters.
        UpdateAsset(ctx, id, issuer, issue_date, owner_id, doc_hash, status, metadata_json) {
            return __awaiter(this, void 0, void 0, function* () {
                // Check if the asset exists
                const exists = yield this.AssetExists(ctx, id);
                if (!exists) {
                    throw new Error(`The asset ${id} does not exist`);
                }
                // Parse the metadata from JSON string
                let metadataObj;
                try {
                    metadataObj = JSON.parse(metadata_json);
                }
                catch (error) {
                    throw new Error(`Invalid metadata JSON format: ${error.message}`);
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
                const assetBuffer = yield ctx.stub.getState(id);
                const existingAsset = JSON.parse(assetBuffer.toString());
                // Create updated asset by merging the existing asset with new values
                const updatedAsset = Object.assign(Object.assign({}, existingAsset), asset);
                // Update the asset in the ledger
                yield ctx.stub.putState(id, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(updatedAsset))));
            });
        }
        // DeleteAsset deletes an given asset from the world state.
        DeleteAsset(ctx, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const exists = yield this.AssetExists(ctx, id);
                if (!exists) {
                    throw new Error(`The asset ${id} does not exist`);
                }
                return ctx.stub.deleteState(id);
            });
        }
        AssetExists(ctx, id) {
            return __awaiter(this, void 0, void 0, function* () {
                const assetJSON = yield ctx.stub.getState(id);
                return assetJSON.length > 0;
            });
        }
        // Revoke Doc
        RevokeAsset(ctx, doc_hash) {
            return __awaiter(this, void 0, void 0, function* () {
                // Check if the document exists by its hash
                const assetJSON = yield ctx.stub.getState(doc_hash);
                if (assetJSON.length === 0) {
                    throw new Error(`The document with hash ${doc_hash} is not found`);
                }
                // Parse the existing asset
                const existingAsset = JSON.parse(assetJSON.toString());
                // Update only the status while preserving all other fields
                existingAsset.Status = "Revoked";
                // Update the asset in the ledger
                yield ctx.stub.putState(doc_hash, Buffer.from((0, json_stringify_deterministic_1.default)((0, sort_keys_recursive_1.default)(existingAsset))));
            });
        }
        GetDocByOwner(ctx, owner_id) {
            return __awaiter(this, void 0, void 0, function* () {
                const assetJSON = yield ctx.stub.getState(owner_id);
                if (assetJSON.length === 0) {
                    throw new Error(`User with ID ${owner_id} is not found`);
                }
                return assetJSON.toString();
            });
        }
    };
    __setFunctionName(_classThis, "AssetTransferContract");
    (() => {
        var _a;
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssetTransferContract = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssetTransferContract = _classThis;
})();
exports.AssetTransferContract = AssetTransferContract;
