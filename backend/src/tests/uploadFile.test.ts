import { uploadFileToIPFS } from "./../upload/uploadFile";
import path from "path";

async function testFileUpload(filePath: string | Buffer) {
  try {
    console.log(`Testing upload for file: ${filePath}`);

    const result = await uploadFileToIPFS({
      fileData: filePath,
      metadata: {
        description: "Test upload with size validation",
        timestamp: new Date().toISOString(),
      },
    });

    console.log("Upload successful!");
    console.log("IPFS URI:", result.uri);
    console.log("Gateway URL:", result.url);
    console.log("CID:", result.cid);
    return result;
  } catch (error: any) {
    console.error("Upload test failed:", error.message);
    return null;
  }
}

//testing hosting  
const currentDir = process.cwd();
const rootPath = path.resolve(
  currentDir,
  "../../../../Pictures/Screenshots/test-file.png"
);

testFileUpload(rootPath);
