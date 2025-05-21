import crypto from "crypto";
import { encrypt } from "eciesjs";
import { ec as EC } from "elliptic";

const encryptOwnerWithPK = async (
  docHash: string,
  certificateBase64: string
): Promise<string> => {
  try {
    // Format the certificate properly with BEGIN/END tags
    const formattedCert = `-----BEGIN CERTIFICATE-----
    ${certificateBase64}
    -----END CERTIFICATE-----`;

    // Create a public key from the certificate
    const publicKey = crypto.createPublicKey(formattedCert);

    const publicKeyDer = publicKey.export({
      format: "der",
      type: "spki",
    });

    // Create a hash of the certificate's public key as a seed for our secp256k1 key
    const certHash = crypto.createHash("sha256").update(publicKeyDer).digest();

    // Generate a deterministic secp256k1 key pair using the certificate hash as seed
    const ec = new EC("secp256k1");
    const keyPair = ec.genKeyPair({
      entropy: certHash.toString("hex"),
    });

    // Get the public key for encryption
    const secp256k1PublicKey = Buffer.from(keyPair.getPublic("array"));

    // console.log("Usin2g deterministic secp256k1 key derived from certificate");
    // console.log(
    //   "Derived public key (hex):",
    //   secp256k1PublicKey.toString("hex")
    // );

    // Use ECIES to encrypt with the secp256k1 public key
    const encrypted = encrypt(secp256k1PublicKey, Buffer.from(docHash));

    // Create a package that includes the encrypted data
    // We don't need to include the private key because it can be deterministically
    // derived from the certificate during decryption
    const encryptedPacket = {
      data: encrypted.toString("base64"),
      // Include a fingerprint of the certificate to verify during decryption
      certFingerprint: crypto
        .createHash("sha256")
        .update(certificateBase64)
        .digest("hex")
        .slice(0, 16), // Just use a prefix for brevity
    };
    // Return the packet as base64-encoded JSON
    return Buffer.from(JSON.stringify(encryptedPacket.data)).toString("base64");
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

export { encryptOwnerWithPK };
