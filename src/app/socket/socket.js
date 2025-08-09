// src/app/socket/sockets.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

// Must add this middleware before Socket.io initialization
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  },
  // These options are crucial:
  path: "/socket.io/",
  connectTimeout: 10000,
  pingTimeout: 60000,
  pingInterval: 25000,
  allowEIO3: true // For v3 compatibility
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Make sure this is at the end of your main app.js:
server.listen(5000, () => {
  console.log(`🚀 Server running on http://localhost:5000`);
  console.log(`🛰️ Socket.io endpoint: ws://localhost:5000/socket.io/`);
});

export { app, io, server };