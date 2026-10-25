"use strict";

const OrderService = require("../services/order.service");
const simulateArrivalDate = require("../utils/arrivalDelay");

const generateOrder = async function (req, res) {
  try {
    const { body } = req;
    // simulate arrival delay for testing
    const arrivalDate = simulateArrivalDate(body.shippingMethod);
    body.expectedArrival = arrivalDate;
    console.log(body);
    const order = await OrderService.insert(body);
    return res.status(200).send({ success: true, order });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

const getActiveOrder = async function (req, res) {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res
        .status(200)
        .send({ success: false, message: "A customer ID is required." });
    }
    const orders = await OrderService.getItemsByCustomerId(customerId);
    return res.status(200).send({ success: true, orders });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const getOrderById = async function (req, res) {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res
        .status(200)
        .send({ success: false, message: "Order ID is required." });
    }

    const order = await OrderService.itemById(orderId);
    return res.status(200).send({
      success: true,
      order,
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const getOrdersByCustomerId = async function (req, res) {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res
        .status(200)
        .send({ success: false, message: "Customer ID is required." });
    }

    const orders = OrderService.getItemsByCustomerId(customerId);
    return res.status(200).send({
      success: true,
      orders: orders,
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const confirmOrder = async function (req, res) {
  try {
    const { orderId } = req.params;
    if (!orderId)
      return res
        .status(200)
        .send({ sucess: false, message: "Order ID is required." });

    const order = await OrderService.itemById(orderId);
    if (!order) {
      return res
        .status(200)
        .send({ sucess: false, message: "Order ID is required." });
    }

    const updatedOrder = await OrderService.confirmItem(order._id);
    return res.status(200).send({
      success: true,
      order: updatedOrder,
    });
  } catch (err) {
    return res.status(500).send({
      status: 500,
      message: err.message,
    });
  }
};

module.exports = {
  generateOrder,
  getOrdersByCustomerId,
  confirmOrder,
  getActiveOrder,
  getOrderById,
};
