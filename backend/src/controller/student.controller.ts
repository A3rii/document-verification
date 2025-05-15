import { Wallets } from "fabric-network";
import path from "path";
import { Request, Response, NextFunction } from "express";

const getAllIdentities = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.trace(wallet);
    // List all identities
    const identities = await wallet.get("kimly");

    res.status(200).json({
      success: true,
      identities: identities,
    });
  } catch (error: any) {
    console.error("Error listing identities:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to list identities",
    });
  }
};

export { getAllIdentities };
