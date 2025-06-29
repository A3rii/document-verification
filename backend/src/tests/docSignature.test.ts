import { getKeyFromWallet } from "../utils/extractKeyFromWallet";
import { signDocWithPrivateKey } from "./../utils/docSignature";
import path from "path";

const main = () => {
  const walletPath = path.resolve(__dirname, "../../wallet");

  const docHash = "QmVLZ9gAyeJJesGFYVWJyww9eTZVy9xZjGaKuxu5M1RWLM";
  const result = getKeyFromWallet(walletPath, "rupp");

  if (result === null) {
    throw new Error("Failed to retrieve identity from wallet");
  }

  const { privateKeyPem } = result;

  console.log(privateKeyPem);
  const signature = signDocWithPrivateKey(docHash, privateKeyPem);
  console.log("Document Signature", signature);
};

main();
