import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StripePaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Stripe.js has not loaded yet.");
      setIsLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      elements.getElement(CardElement)
    );

    if (error) {
      setError(error.message);
    } else if (paymentIntent.status === "succeeded") {
      // Payment succeeded, redirect to success page
      navigate("/checkout/success");
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div>{error}</div>}
      <button type="submit" disabled={!stripe || isLoading}>
        {isLoading ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
