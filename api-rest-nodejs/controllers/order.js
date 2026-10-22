"use strict";

const OrderService = require("../services/order.service");
const Order = require("../models/order");
const StripeService = require("../services/stripe.service");

const generateOrder = async function (req, res) {
  try {
    const { body } = req;
    const order = await OrderService.insert({
      customer: body.customer,
      items: body.items,
      discount: body.discount,
      subtotal: body.subtotal,
      total: body.total,
      shippingCost: body.shippingCost,
      coupon: body.coupon ? body.coupon._id : null,
      paymentMethodProviderId: body.paymentMethodProviderId
        ? body.paymentMethodProviderId
        : null,
      paymentProviderName: body.paymentProviderName,
    });

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

const updateOrder = async function (req, res) {
  if (!req.params["orderId"])
    return res.status(200).send({ message: "An order ID is required." });
  //if(!req.body) return res.status(200).send({ message: 'An order ID is required.' });

  try {
    // Search actual order
    const resOrder = await Order.findOne({ _id: req.params["orderId"] });

    // Generate payment method
    const token = req.body.token;

    const responseMethod = await Stripe.generatePaymentMethod(token);

    // Generate payment intents
    const resPaymentIntent = await Stripe.generatePaymentIntent({
      amount: resOrder.amount,
      user: resOrder.customerID,
      payment_method: responseMethod.id,
    });

    console.log(resPaymentIntent);
    console.log("ok2");
    // Update stripeID field in order
    await Order.findByIdAndUpdate(
      { _id: req.params["orderId"] },
      {
        stripeId: resPaymentIntent.id,
      },
    );

    console.log("culo el que lo lea");
    console.log(resPaymentIntent);
    res.send({ data: resPaymentIntent });
  } catch (err) {
    console.log(err.message);
    return res
      .status(500)
      .send({ message: "Something was wrong. Try again later." });
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
  updateOrder,
  confirmOrder,
  getActiveOrder,
  getOrderById,
};
