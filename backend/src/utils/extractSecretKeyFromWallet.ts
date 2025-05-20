import * as fs from "fs";
import * as path from "path";

interface FabricIdentity {
  credentials: {
    certificate: string;
    privateKey: string;
  };
  mspId: string;
  type: string;
  version: number;
}

interface IdentityResult {
  identity: FabricIdentity;
  privateKeyPem: string;
}

const getPrivateKeyFromWallet = (
  walletPath: string,
  name: string
): IdentityResult | null => {
  try {
    const userDirectory = path.join(walletPath, `${name}.id`);

    // Check if the user directory exists
    if (!fs.existsSync(userDirectory)) {
      console.error(`User ${name} not found in wallet`);
      return null;
    }

    // The private key is stored in a file inside the user directory
    const identityFilePath = path.join(userDirectory);

    // Read the identity file
    if (!fs.existsSync(identityFilePath)) {
      console.error(`Identity file for user ${name} not found`);
      return null;
    }

    // Read and parse the identity file
    const identityJson = fs.readFileSync(identityFilePath, "utf8");
    const identity = JSON.parse(identityJson) as FabricIdentity;

    // Extract the private key
    if (
      identity.type === "X.509" &&
      identity.credentials &&
      identity.credentials.privateKey
    ) {
      return {
        identity: identity,
        privateKeyPem: identity.credentials.privateKey,
      };
    } else {
      console.error(`Private key not found for user ${name}`);
      return null;
    }
  } catch (error) {
    console.error(`Error retrieving private key for ${name}: ${error}`);
    return null;
  }
};

export { getPrivateKeyFromWallet };
