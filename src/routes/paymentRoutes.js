import express from "express";
import { createPaymentIntent } from "../app/controllers/paymentController.js";


const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);



export default router;