import crypto from "crypto";
import { encrypt } from "eciesjs";
import { ec as EC } from "elliptic";

const encryptOwnerWithPK = async (
  docHash: string,
  certificateBase64: string
): Promise<string> => {
  try {
    // Create a public key from the certificate
    const publicKey = crypto.createPublicKey(certificateBase64);
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

    // FIX 1: Use compressed public key format (33 bytes) for better ECIES compatibility
    const secp256k1PublicKey = Buffer.from(keyPair.getPublic(true, "array"));

    console.log("Public key length:", secp256k1PublicKey.length); // Should be 33
    console.log(
      "Derived public key (hex):",
      secp256k1PublicKey.toString("hex")
    );

    // Use ECIES to encrypt with the secp256k1 public key
    const encrypted = encrypt(secp256k1PublicKey, Buffer.from(docHash));

    // Create a package that includes the encrypted data
    const encryptedPacket = {
      data: encrypted.toString("base64"),
      // Include a fingerprint of the certificate to verify during decryption
      certFingerprint: crypto
        .createHash("sha256")
        .update(certificateBase64)
        .digest("hex")
        .slice(0, 16), // Just use a prefix for brevity
    };

    const messageEncrypted = Buffer.from(
      JSON.stringify(encryptedPacket.data)
    ).toString();
    return messageEncrypted.replace(/"/g, "");
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

export { encryptOwnerWithPK };
