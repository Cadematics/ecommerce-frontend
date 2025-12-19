import api from "./axios";

export const createOrder = (data) =>
  api.post("/orders/", data);

export const listOrders = () =>
  api.get("/orders/");