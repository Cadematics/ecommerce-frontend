import api from "./axios";

export const createStripePaymentIntent = (data) =>
  api.post("/payments/stripe/create-intent/", data);
