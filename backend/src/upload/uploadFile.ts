import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { FileUploadProps } from "../types/file-type";
import { extractCID } from "./../utils/extractCID";
import fs from "fs";
import path from "path";
import "dotenv/config";

//client id for thirdweb api
const storage = new ThirdwebStorage({
  clientId: "8920485d1a083bb2d3854bbe524817d7",
});

const uploadFileToIPFS = async ({
  fileData,
  fileName,
  metadata = {},
}: FileUploadProps): Promise<{ uri: string; url: string; cid: string }> => {
  try {
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    let processedData: Buffer;
    let fileSize: number;

    // Handle different input types
    if (typeof fileData === "string") {
      if (!fs.existsSync(fileData)) {
        throw new Error(`File does not exist at path: ${fileData}`);
      }

      processedData = fs.readFileSync(fileData);
      fileSize = processedData.length;
      fileName = fileName || path.basename(fileData);
    } else if (Buffer.isBuffer(fileData)) {
      // If fileData is already a Buffer
      processedData = fileData;
      fileSize = fileData.length;

      if (fileSize > MAX_FILE_SIZE) {
        throw new Error(
          `File size exceeds the maximum allowed size of 2MB. Current size: ${(
            fileSize /
            (1024 * 1024)
          ).toFixed(2)}MB`
        );
      }

      if (!fileName) {
        throw new Error("fileName is required when uploading a Buffer");
      }
    } else {
      throw new Error("Invalid file data: must be a file path or Buffer");
    }

    console.log(`Processing file: ${fileName} (${fileSize} bytes)`);
    1;
    let uploadData: any;

    if (Object.keys(metadata).length > 0) {
      uploadData = {
        name: fileName,
        data: processedData,
        ...metadata,
      };
    } else {
      uploadData = processedData;
    }

    // Upload to IPFS
    const uri = await storage.upload(uploadData);
   
   
    //getting only hash from the uri
    const cid = extractCID(uri);
    const url = storage.resolveScheme(uri);

    return { uri, url, cid };
  } catch (error) {
    console.error("Error uploading file to IPFS:", error);
    throw error;
  }
};

export { uploadFileToIPFS };
