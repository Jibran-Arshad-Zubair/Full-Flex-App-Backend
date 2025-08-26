import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:5000'],
        methods: ["GET", "POST"],
        credentials: true
    },
});

const userSocketMap = {};  // Here i am creating a map to store user IDs and socket IDs

io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id; // Here i am storing the mapping of userId to socket.id
    }

    io.emit('getOnlineUsers', Object.keys(userSocketMap)); // Here i am using the emit to send data from backend to frontend

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
       
        const disconnectedUserId = Object.keys(userSocketMap).find(
            key => userSocketMap[key] === socket.id
        );
        if (disconnectedUserId) {
            delete userSocketMap[disconnectedUserId];
            io.emit('getOnlineUsers', Object.keys(userSocketMap));
        }
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

export { app, io, server };