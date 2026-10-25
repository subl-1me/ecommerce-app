"use strict";

const StripeService = require("../services/stripe.service");
const SaleService = require("../services/sale.service");
const OrderService = require("../services/order.service");

const createPaymentIntent = async function (req, res) {
  try {
    const { body } = req;
    const paymentIntent = await StripeService.generatePaymentIntent(
      body.paymentIntent,
    );

    // add sale & confirm order
    if (!paymentIntent.status === "succeeded") {
      return res
        .status(200)
        .send({ success: false, message: "Error processing payment." });
    }

    await SaleService.insert({
      order: body.order._id,
      stripePaymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      status: "succeeded",
      paidAt: new Date(),
    });

    await OrderService.confirmItem(body.order._id);

    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  createPaymentIntent,
};
