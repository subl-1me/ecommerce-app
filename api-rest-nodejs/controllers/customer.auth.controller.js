"use strict";

const Customer = require("../models/customer");
const CustomerAuthService = require("../services/customer.auth.service");

const register = async function (req, res) {
  try {
    const { body } = req;
    const customer = await Customer.findOne({
      email: body.email,
    });

    if (customer) {
      return res
        .status(200)
        .send({ success: false, message: "Email already taken." });
    }
    const response = await CustomerAuthService.create(body);
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const login = async function (req, res) {
  try {
    const { body } = req;
    const customer = await Customer.findOne({ email: body.email }).populate({
      path: "cart",
      populate: { path: "items", populate: { path: "product" } },
    });
    if (!customer)
      return res
        .status(404)
        .send({ success: false, message: "User doesn't exist." });
    const result = await CustomerAuthService.auth(body.password, customer);
    if (!result.auth)
      return res.status(400).send({ success: false, message: result.message });

    return res.status(200).send({
      success: true,
      auth: result.auth,
      jwt: result.jwt,
      customer: result.customer,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  register,
  login,
};
