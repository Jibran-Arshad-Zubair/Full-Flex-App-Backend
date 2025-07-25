import stripePackage from "stripe";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Create a Payment Intent
 * @route   POST /api/payments/create-payment-intent
 * @access  Public
 */
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = "PKR" } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency,
      automatic_payment_methods: { enabled: true },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ error: "Payment processing failed" });
  }
};


/**
 * @desc    Save Payment to DB (Optional)
 * @route   POST /api/payments/save-payment
 * @access  Private
 */
// export const savePayment = async (req, res) => {
//   try {
//     const { paymentId, amount, userId } = req.body;

//     const payment = new Payment({ paymentId, amount, userId });
//     await payment.save();

//     res.status(201).json({ success: true, payment });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to save payment" });
//   }
// };