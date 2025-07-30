import express from "express";

import { checkAuth } from "../app/middlewares/handlers/checkAuth.js";
import { sendMessage } from "../app/controllers/messageController/index.js";

const router = express.Router();


router.post("/send-message/:id", checkAuth, sendMessage);

export default router;
