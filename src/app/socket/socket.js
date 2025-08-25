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

io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });

    socket.on('error', (error) => {
        console.error('Socket error:', error);
    });
});

export { app, io, server };