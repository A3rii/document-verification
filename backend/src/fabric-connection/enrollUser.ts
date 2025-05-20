import FabricCAServices from "fabric-ca-client";
import { Wallets } from "fabric-network";
import fs from "fs";
import path from "path";

async function main() {
  try {
    // Load the connection profile
    const ccpPath = path.resolve(__dirname, "connection.json");
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Extract CA Info
    const caInfo = ccp.certificateAuthorities["ca.org1.example.com"];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(
      caInfo.url,
      { trustedRoots: caTLSCACerts, verify: false },
      caInfo.caName
    );

    // Create wallet
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if appUser already exists
    const identity = await wallet.get("appUser");
    if (identity) {
      console.log(
        'An identity for the user "appUser" already exists in the wallet'
      );
      return;
    }

    // Check if admin identity is in the wallet
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log(
        "admin identity not found in wallet. Please enroll admin first."
      );
      return;
    }

    // Build a provider for admin identity
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register and enroll appUser
    const secret = await ca.register(
      {
        affiliation: "org1.department1",
        enrollmentID: "appUser",
        role: "client",
      },
      adminUser
    );

    const enrollment = await ca.enroll({
      enrollmentID: "appUser",
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };

    await wallet.put("appUser", x509Identity);
    console.log(
      'Successfully registered and enrolled "appUser" and imported it into the wallet'
    );
  } catch (error) {
    console.error(`Failed to enroll user: ${error}`);
    process.exit(1);
  }
}

main();
