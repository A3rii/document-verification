import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: `server is running on ${process.env.PORT}`,
  });
});

export default app;
