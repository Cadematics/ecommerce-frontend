import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import StripePaymentForm from "../components/StripePaymentForm";
import stripePromise from "../stripe/stripe";
import * as ordersApi from "../api/orders.api";
import * as paymentsApi from "../api/payments.api";
import * as cartApi from "../api/cart.api";

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const createOrderAndPaymentIntent = async () => {
      try {
        // 1. Create order from cart
        const cart = await cartApi.getCart();
        const order = await ordersApi.createOrder({ cart_id: cart.data.id });
        setOrder(order.data);

        // 2. Create Stripe PaymentIntent
        const paymentIntent = await paymentsApi.createStripePaymentIntent({
          order_id: order.data.id,
        });

        setClientSecret(paymentIntent.data.client_secret);
      } catch (error) {
        console.error("Error creating order and payment intent:", error);
      }
    };

    createOrderAndPaymentIntent();
  }, []);

  if (!clientSecret || !order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Checkout</h1>
      <p>Order ID: {order.id}</p>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <StripePaymentForm />
      </Elements>
    </div>
  );
}
