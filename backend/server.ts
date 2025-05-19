import app from "./app";
import http from "http";
import "dotenv/config";
import connectIPFS from "./src/configs/ifps";
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(PORT, async () => {
  await connectIPFS();
  console.log(`Network is running on: http://127.0.0.1:${PORT}`);
});
