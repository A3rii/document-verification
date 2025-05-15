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
      console.log("Identity user not found in wallet");
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

    // folder where u  store the smart contract
    const contract = network.getContract("ledger");
    const initLedger = await contract.submitTransaction("InitLedger");

    console.log("Ledger Init Successfully" + initLedger);

    const result = await contract.evaluateTransaction("GetAllAssets");

    const jsonResult = JSON.parse(result.toString());
    console.log("Transaction successful, result:", jsonResult);
    gateway.disconnect();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

main();
