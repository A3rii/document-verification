import mongoose from "mongoose";
import "dotenv/config";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_DB_URI!);
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;

  dbConnection.once("open", () => {
    console.log(`Database connected ` + "" + process.env.MONGO_DB_URI);
  });

  dbConnection.on("error", (err) => {
    console.error(`Connection error: ${err}`);
  });
};
export default connectDB;
