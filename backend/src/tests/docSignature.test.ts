import { getPrivateKeyFromWallet } from "./../utils/extractSecretKeyFromWallet";
import { signDocWithPrivateKey } from "./../utils/docSignature";
const main = () => {
  const walletPath = "./../../wallet";
  const docHash = "QmVLZ9gAyeJJesGFYVWJyww9eTZVy9xZjGaKuxu5M1RWLM";
  const result = getPrivateKeyFromWallet(walletPath, "admin");
  if (result === null) {
    throw new Error("Failed to retrieve identity from wallet");
  }

  const { privateKeyPem } = result;
  console.log(privateKeyPem);
  const signature = signDocWithPrivateKey(docHash, privateKeyPem);
  console.log(process.cwd());
  console.log("Document Signature", signature);
};

main();
