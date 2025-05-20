import FabricCAServices from "fabric-ca-client";
import { Wallets, Wallet } from "fabric-network";
import fs from "fs";
import path from "path";

export class CAClient {
  static initialize() {
    throw new Error("Method not implemented.");
  }
  private ca?: FabricCAServices;
  private wallet?: Wallet;
  private mspId: string;
  private walletPath: string;
  private initialized: boolean = false;

  constructor() {
    this.mspId = process.env.MSP_ID || "Org1MSP";
    this.walletPath = path.join(process.cwd(), "wallet");
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Load connection profile
      const ccpPath = path.resolve(
        __dirname,
        "../fabric-connection/connection.json"
      );

      // Check if connection profile exists
      if (!fs.existsSync(ccpPath)) {
        throw new Error(`Connection profile not found at ${ccpPath}`);
      }

      const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

      // Extract CA Info with error checking
      const caInfo = ccp.certificateAuthorities?.["ca.org1.example.com"];
      if (!caInfo) {
        throw new Error("CA configuration not found in connection profile");
      }

      const caTLSCACerts = caInfo.tlsCACerts?.pem;
      if (!caTLSCACerts) {
        throw new Error("CA TLS certificates not found");
      }

      // Create CA client
      this.ca = new FabricCAServices(
        caInfo.url,
        { trustedRoots: caTLSCACerts, verify: false },
        caInfo.caName
      );

      // Create wallet
      this.wallet = await Wallets.newFileSystemWallet(this.walletPath);
      this.initialized = true;
    } catch (error) {
      throw new Error(`Failed to initialize CA client: ${error}`);
    }
  }

  getCA(): FabricCAServices {
    if (!this.ca) {
      throw new Error("CA client not initialized. Call initialize() first.");
    }
    return this.ca;
  }

  getWallet(): Wallet {
    if (!this.wallet) {
      throw new Error("Wallet not initialized. Call initialize() first.");
    }
    return this.wallet;
  }

  getMspId(): string {
    return this.mspId;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}

export const caClient = new CAClient();
