import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db-connection.js";
import cors from "cors";
import paymentRoutes from "./src/routes/paymentRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// API base route
app.use("/api/v1/payments", paymentRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
