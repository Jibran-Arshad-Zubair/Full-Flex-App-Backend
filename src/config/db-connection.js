import mongoose from "mongoose";
import { envDevDatabaseURL, envMode, envProdDatabaseURL } from "./index.js";

const connectDB = async () => {
  try {
    const dbURL = envMode === "prod" ? envProdDatabaseURL : envDevDatabaseURL;

    if (!dbURL) {
      throw new Error("Database URL is not defined. Check your .env file.");
    }

    console.log(`Attempting to connect to ${envMode} database...`);
    
    const conn = await mongoose.connect(dbURL, {
      retryWrites: true,
      w: "majority",
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    console.log(` ✅ MongoDB Connected to ${envMode} DB`);
  } catch (error) {
    console.error(`❌ Error connecting to DB: ${error.message}`);
    console.error("Make sure:");
    console.error("1. Your MongoDB connection string is correct in .env");
    console.error("2. Your IP is whitelisted in MongoDB Atlas");
    console.error("3. Your username/password is correct");
    process.exit(1);
    
  }
};

export default connectDB;
