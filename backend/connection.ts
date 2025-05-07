import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";

async function main() {
  console.log("Connection is starting");

  try {
    // Load the connection profile
    const ccpPath = path.resolve(
      __dirname,
      "fabric-connection/connection.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a wallet with identity
    const walletPath = path.join(process.cwd(), "fabric-connection/wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get("appUser");

    if (!identity) {
      console.log('Identity "appUser" not found in wallet');
      return;
    }

    // Connect gateway to the network
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "appUser",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("document");
    const contract = network.getContract("basic");

    const result = await contract.evaluateTransaction("GetAllAssets");
    console.log(`Transaction successful, result: ${result.toString()}`);

    gateway.disconnect();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

main();
