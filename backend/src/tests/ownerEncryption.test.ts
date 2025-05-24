import { encryptOwnerWithPK } from "../utils/encryptOwnerWithPK";
import { getKeyFromWallet } from "./../utils/extractKeyFromWallet";
import path from "path";
// Function Testing
const main = async () => {
  try {
    const walletPath = path.resolve(__dirname, "../../wallet");


    const result = getKeyFromWallet(walletPath, "kim");

    if (result === null) {
      throw new Error("Failed to retrieve identity from wallet");
    }

    const { certificatePem } = result;

    const encryptedMessage = await encryptOwnerWithPK(
      "QmVLZ9gAyeJJesGFYVWJyww9eTZVy9xZjGaKuxu5M1RWLM",
      certificatePem
    );
    console.log(encryptedMessage);
  } catch (error) {
    console.error("Error in main:", error);
  }
};
main();
