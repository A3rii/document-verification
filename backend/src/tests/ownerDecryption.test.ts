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
      "BInn5mxs1veMYb5dMXqT82aq9h1CLnuHOpZt36OxyTwXlZm2M+lSPD6RtQuCaGvLEUgjUkFF3w9Yabz9RT9EpMHIJ+dCY1krucv1JNHTH5xMuHdj1v9PYRnZB8387D2Dx/ZKrgiGyge3zca+A3FiveKIlZnNBYw+mKQA2Ag2RZFjd5vP9GD0fY8mRvFQYW0='";
    // Decrypt
    const decryptedMessage = decryptOwnerMessage(encryptedMessage, identity);

    console.log("Decrypted message:", decryptedMessage);

    // Verify (assuming the expected result is this hash)
    const expectedResult = "QmVLZ9gAyeJJesGFYVWJyww9eTZVy9xZjGaKuxu5M1RWLM";
    console.log(
      "Decryption matches expected result:",
      decryptedMessage === expectedResult
    );
  } catch (error) {
    console.error("Error in main:", error);
  }
};

main();
