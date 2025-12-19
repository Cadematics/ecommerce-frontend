
// src/stripe/stripe.js
import { loadStripe } from "@stripe/stripe-js";

// It's best to load the Stripe publishable key from an environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default stripePromise;
