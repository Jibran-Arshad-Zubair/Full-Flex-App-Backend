import express from "express";
import { createPaymentIntent, savePayment } from "../app/controllers/paymentController";


const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);

router.post("/save-payment", savePayment);

export default router;