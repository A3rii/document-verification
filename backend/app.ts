import express from "express";
import bodyParser from "body-parser";
import document from "./src/routes/document.routes";
import enrollment from "./src/routes/register.routes";
import student from "./src/routes/student.routes";
import morgan from "morgan";
import auth from "./src/routes/auth.routes";
import connectDB from "./src/configs/database";
import cors from "cors";
import expressListEndpoints from "express-list-endpoints";
import "dotenv/config";
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("dev"));

app.use(cors());
app.get("/", (req, res) => {
  const endpoints = expressListEndpoints(app);
  res.status(200).json({
    message: `server is running on port ${process.env.PORT}`,
    endpoints,
  });
});
app.use("/api/v1/document", document);
app.use("/api/v1/auth/enroll", enrollment);
app.use("/api/v1/student", student);

connectDB().then(() => {
  app.use("/api/v1/auth", auth);
});

export default app;
