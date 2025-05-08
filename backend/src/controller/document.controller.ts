import { Gateway, Wallets } from "fabric-network";
import path from "path";
import fs from "fs";

// Read All Documents
const GetAllDocument = async (req: Request, res: Response) => {
  try {
  } catch (err: Error) {
    return res.status(500).json({ error: err.message });
  }
};

export { GetAllDocument };
