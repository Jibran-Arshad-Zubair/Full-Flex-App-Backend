import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db-connection.js";
import cors from "cors";
import PaymentRoutes from "./src/routes/paymentRoutes.js";
import UserRoutes from "./src/routes/userRoutes.js";
import MessageRoutes from "./src/routes/messageRoutes.js";
dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// API base route
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/users", UserRoutes );
app.use("/api/v1/messages", MessageRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
