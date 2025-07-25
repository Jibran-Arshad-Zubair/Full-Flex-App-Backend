import mongoose from "mongoose";
import { envDevDatabaseURL, envMode, envProdDatabaseURL } from "./index.js";

const connectDB = async () => {
  try {
    const dbURL = envMode === "prod" ? envProdDatabaseURL : envDevDatabaseURL;

    if (!dbURL) {
      throw new Error("Database URL is not defined.");
    }

    const conn = await mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(` MongoDB Connected to ${envMode} DB`);
  } catch (error) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1);
    
  }
};

export default connectDB;
