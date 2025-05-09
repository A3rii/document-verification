import express from "express";
import bodyParser from "body-parser";
import document from "./src/routes/document.routes";
import morgan from "morgan";
import expressListEndpoints from "express-list-endpoints";
import "dotenv/config";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.status(200).json({
    message: `server is running on port ${process.env.PORT}`,
    endpoints,
  });
});

app.use("/api", document);

export default app;
