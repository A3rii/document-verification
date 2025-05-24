import { getKeyFromWallet } from "./../utils/extractKeyFromWallet";
import { decryptOwnerMessage } from "./../utils/decryptOwnerMessage";
import path from "path";
// Function Testing
const main = async () => {
  const walletPath = path.resolve(__dirname, "../../wallet");

  try {
    const result = getKeyFromWallet(walletPath, "bora");

    // Check if result is null
    if (result === null) {
      throw new Error("Failed to retrieve identity from wallet");
    }
    const { identity } = result;
    console.log(identity);
    // The encrypted message
    const encryptedMessage =
      "BMvVwCU8Ir652zIVkbVJLNOL9dFEGdUp7JVELqaANq4v4zwNopbxz6x/05o417BewEAQ3nD1IYnYTeEfF8IoLMEsomNkn5BWEWv27XtjTt+KxoDweUtE2sEj0rLR0lSil7NUMNDWbpVOgMi+0kq5Np0HkjhKCKE/05XjZvMtw/bQZC3TrCpAUFRR/5QlcBU=";
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
