import crypto from "crypto";
const signDocWithPrivateKey = (
  docHash: string,
  privateKeyPem: string
): string => {
  try {
    // Normalize the private key format to handle various newline formats
    const normalizedPrivateKey = privateKeyPem
      .replace(/\r\n/g, "\n") // Convert Windows line endings to Unix
      .replace(/\\r\\n/g, "\n"); // Convert escaped Windows line endings

    // Load the private key with explicit format
    const privateKey = crypto.createPrivateKey({
      key: normalizedPrivateKey,
      format: "pem",
      type: "pkcs8",
    });

    // Create a SHA-256 digest of the document hash
    const digest = crypto.createHash("sha256").update(docHash).digest();

    // Sign the digest using ECDSA with ieee-p1363 encoding (compatible with Fabric)
    const signature = crypto.sign(null, digest, {
      key: privateKey,
      dsaEncoding: "ieee-p1363", // Format used by Hyperledger Fabric
    });

    // Return the signature as Base64-encoded string
    return signature.toString("base64");
  } catch (error) {
    console.error("Signing error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    throw error;
  }
};

const verifiSignature = (
  docHash: string,
  signature: string,
  publicKeyPem: string
): boolean => {
  try {
    // Normalize the public key format
    const normalizedPublicKey = publicKeyPem
      .replace(/\r\n/g, "\n")
      .replace(/\\r\\n/g, "\n");

    // Load the public key
    const publicKey = crypto.createPublicKey({
      key: normalizedPublicKey,
      format: "pem",
      type: "spki",
    });

    // Create the same SHA-256 digest of the document hash
    const digest = crypto.createHash("sha256").update(docHash).digest();

    // Convert signature from base64 to buffer
    const signatureBuffer = Buffer.from(signature, "base64");

    // Verify the signature using the same encoding format
    const isValid = crypto.verify(
      null,
      digest,
      {
        key: publicKey,
        dsaEncoding: "ieee-p1363",
      },
      signatureBuffer
    );

    return isValid;
  } catch (error) {
    console.error("Verification error:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    return false;
  }
};
export { signDocWithPrivateKey, verifiSignature };
