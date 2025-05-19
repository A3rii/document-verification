import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";

const connectToNetwork = async () => {
  const ccpPath = path.resolve(__dirname, "fabric-connection/connection.json");
  const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

  const walletPath = path.join(process.cwd(), "wallet");
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const identity = await wallet.get("admin");
  if (!identity) {
    throw new Error("Admin identity not found in wallet");
  }

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: "admin",
    discovery: { enabled: true, asLocalhost: true },
  });

  const network = await gateway.getNetwork("mychannel");
  const contract = network.getContract("ledger");

  return { gateway, contract };
};

export { connectToNetwork };
