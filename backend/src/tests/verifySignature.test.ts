import { getKeyFromWallet } from "../utils/extractKeyFromWallet";
import { verifiSignature } from "./../utils/docSignature";
import path from "path";
const main = () => {
  const walletPath = path.resolve(__dirname, "../../wallet");

  const docHash = "QmVLZ9gAyeJJesGFYVWJyww9eTZVy9xZjGaKuxu5M1RWLM";
  const result = getKeyFromWallet(walletPath, "rupp");
  const signatureOutput =
    "GNOl2y667W+TXDJEZ5Taapok3Xb8dx75+/KKCLM73OufPTJq8lZ7191gB6ie9J6tFeiJMuUzmxfdl7Jrk60VQ==";
  if (result === null) {
    throw new Error("Failed to retrieve identity from wallet");
  }

  const { certificatePem } = result;

  console.log(certificatePem);
  const signature = verifiSignature(docHash, signatureOutput, certificatePem);
  console.log("Document Signature", signature);
};

main();
