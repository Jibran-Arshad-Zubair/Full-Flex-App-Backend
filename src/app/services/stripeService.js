import stripePackage from "stripe";
const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

export const createStripePaymentIntent = async (amount, currency = "PKR") => {
  return await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    automatic_payment_methods: { enabled: true },
  });
};