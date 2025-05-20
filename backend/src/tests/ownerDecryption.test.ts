import { getPrivateKeyFromWallet } from "./../utils/extractSecretKeyFromWallet";
import { decryptOwnerMessage } from "./../utils/decryptOwnerMessage";
// Function Testing
const main = async () => {
  const walletPath = "./../wallet";
  try {
    const result = getPrivateKeyFromWallet(walletPath, "neon");

    // Check if result is null
    if (result === null) {
      throw new Error("Failed to retrieve identity from wallet");
    }
    const { identity } = result;
    // The encrypted message
    const encryptedMessage =
      "BFNVwA/xTQvB9c5v340Hbz9UrfK3cyAYW/q0fTqhrR8VZ+MQ/cLclo9FbTr6/harHSQ0kv91D/L1v2cwW1ygJD5P1ec0FuNnD5q0hiLE59nJr5/MgFM3Bplp1SGPR7hGN7C6IO0nBW2Mp0lgYoGkaqkXaO1J43CbiUaeKpbIYI5N";
    // Decrypt
    const decryptedMessage = decryptOwnerMessage(encryptedMessage, identity);

    console.log("Decrypted message:", decryptedMessage);

    // Verify (assuming the expected result is this hash)
    const expectedResult = "8743b52063cd84097a65d1633f5c74f5";
    console.log(
      "Decryption matches expected result:",
      decryptedMessage === expectedResult
    );
  } catch (error) {
    console.error("Error in main:", error);
  }
};

main();
