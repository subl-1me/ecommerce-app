"use strict";
const jwt = require("../helpers/jwt");
const bcrypt = require("bcryptjs");
const { safeCredentials } = require("../helpers/safeCredentials");
const Customer = require("../models/customer");
const CartService = require("../services/cart.service");

const auth = async function (userInput, customer) {
  // try to login
  const hash = customer.password;
  const check = await bcrypt.compare(userInput, hash);
  if (!check) {
    throw new Error("Password dont match");
  }

  return {
    auth: true,
    customer: safeCredentials(customer),
    jwt: jwt.createToken(customer),
  };
};

const create = async function (body) {
  const hash = await bcrypt.hash(body.password, 10);
  if (!hash) {
    throw new Error("Error hashing password.");
  }

  // create user cart & misc...
  const newCart = await CartService.add({ items: [] });
  body.password = hash;
  body.cart = newCart._id; // ref
  const newCustomer = await Customer.create(body);
  if (!newCustomer) {
    throw new Error("Error trying to create user. Try again later.");
  }

  return {
    error: false,
    customer: newCustomer,
  };
};

module.exports = {
  auth,
  create,
};
