import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db-connection.js";
import cors from "cors";
import PaymentRoutes from "./src/routes/paymentRoutes.js";
import UserRoutes from "./src/routes/userRoutes.js";
import MessageRoutes from "./src/routes/messageRoutes.js";
import CourseRoutes from "./src/routes/courseRoutes.js";
import path from "path";
import { app, server } from './src/app/socket/socket.js'; 
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API base route
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/messages", MessageRoutes);
app.use("/api/v1/courses", CourseRoutes);

const PORT = process.env.PORT || 5000;

// Use server.listen instead of app.listen
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});