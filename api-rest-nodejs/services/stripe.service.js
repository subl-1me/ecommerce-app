"use strict";
const stripe = require("stripe")(process.env.STRIPE_PK_SECRET);

// Generate payment intent
const generatePaymentIntent = async function (intent) {
  console.log(process.env.STRIPE_PK_SECRET);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: intent.amount,
    currency: intent.currency,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
    confirm: true, // default for testing
    payment_method: intent.stripe_pm,
    description: intent.description,
  });

  return paymentIntent;
};

const generatePaymentMethod = async function (token) {
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: { token: token.id },
  });

  return paymentMethod;
};

const confirmPaymentIntent = async function (id, token) {
  const paymentIntent = await stripe.paymentIntents.confirm(id, {
    payment_method: token,
  });

  return paymentIntent;
};

module.exports = {
  generatePaymentIntent,
  generatePaymentMethod,
  confirmPaymentIntent,
};
