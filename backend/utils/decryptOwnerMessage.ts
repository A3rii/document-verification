import crypto from "crypto";
import { decrypt } from "eciesjs";
var EC = require("elliptic").ec;
interface FabricIdentity {
  credentials: {
    certificate: string;
    privateKey: string;
  };
  mspId: string;
  type: string;
  version: number;
}

const decryptOwnerMessage = (
  encryptedBase64: string,
  identityJson: string | FabricIdentity | null
): string => {
  try {
    // Parse the identity if it's a string
    const identity =
      typeof identityJson === "string"
        ? JSON.parse(identityJson)
        : identityJson;

    // Extract the certificate without BEGIN/END tags
    const certificateBase64 = identity.credentials.certificate
      .replace(/-----BEGIN CERTIFICATE-----\r?\n/, "")
      .replace(/\r?\n-----END CERTIFICATE-----\r?\n?/, "")
      // Handle escaped newlines that may be present in JSON strings
      .replace(/\\n/g, "");

    // Create a public key from the certificate
    const formattedCert = `-----BEGIN CERTIFICATE-----
${certificateBase64}
-----END CERTIFICATE-----`;

    // Create a public key from the certificate
    const publicKey = crypto.createPublicKey(formattedCert);

    // Extract the DER-encoded public key in SPKI format from the certificate
    const publicKeyDer = publicKey.export({
      format: "der",
      type: "spki",
    });

    // Create the same hash of the certificate's public key
    const certHash = crypto.createHash("sha256").update(publicKeyDer).digest();

    const ec = new EC("secp256k1");
    const keyPair = ec.genKeyPair({
      entropy: certHash.toString("hex"),
    });

    // Get the private key for decryption
    const privateKeyHex = keyPair.getPrivate("hex");

    let encryptedData: Buffer;
    try {
      // First try to parse as JSON
      const encryptedPacket = JSON.parse(
        Buffer.from(encryptedBase64, "base64").toString()
      );

      // Verify the certificate fingerprint if present
      if (encryptedPacket.certFingerprint) {
        console.log("Verifying certificate fingerprint");
        const actualFingerprint = crypto
          .createHash("sha256")
          .update(certificateBase64)
          .digest("hex")
          .slice(0, 16);

        if (encryptedPacket.certFingerprint !== actualFingerprint) {
          console.warn(`Certificate fingerprint mismatch: 
            Expected: ${encryptedPacket.certFingerprint} 
            Actual: ${actualFingerprint}`);
        }
      }

      // Extract the encrypted data from the packet
      encryptedData = Buffer.from(encryptedPacket.data, "base64");
    } catch (error) {
      // If JSON parsing fails, assume it's raw encrypted data
      encryptedData = Buffer.from(encryptedBase64, "base64");
    }

    // Decrypt using the deterministic private key
    const decrypted = decrypt(privateKeyHex, encryptedData);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};
export { decryptOwnerMessage };
