import { getPrivateKeyFromWallet } from "./../utils/extractSecretKeyFromWallet";
import { signDocWithPrivateKey } from "./../utils/docSignature";
const main = () => {
  const walletPath = "./../wallet";
  const docHash = "8743b52063cd84097a65d1633f5c74f5";
  const result = getPrivateKeyFromWallet(walletPath, "neon");
  if (result === null) {
    throw new Error("Failed to retrieve identity from wallet");
  }

  const { privateKeyPem } = result;

  const signature = signDocWithPrivateKey(docHash, privateKeyPem);

  console.log("Document Signature", signature);
};

main();
