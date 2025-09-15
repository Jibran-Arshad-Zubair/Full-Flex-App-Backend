import express from "express";
import { chatWithBot } from "../app/controllers/chatBot/chatBotController.js";
const router = express.Router();

router.post("/chat", chatWithBot);

export default router;
