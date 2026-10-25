"use strict";

const Customer = require("../models/customer");
const CustomerService = require("../services/customer.service");
const credentials = require("../helpers/safeCredentials");
const generator = require("../helpers/passwordGenerator");

// get customers list
const list = async function (req, res) {
  try {
    const { authentication } = req;
    if (!authentication || authentication.role !== "Admin")
      return res
        .status(403)
        .send({ success: false, message: "You are not authorized." });

    const filter = req.query.filter;
    const value = req.query.value;

    const customers = filter
      ? await CustomerService.itemsByFilter(filter, value)
      : await CustomerService.items();

    return res.status(200).send({
      success: true,
      list: customers,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const listById = async function (req, res) {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(200)
        .send({ success: false, message: "Customer ID is required." });

    const customer = await CustomerService.item(id);
    res.status(200).send({
      success: true,
      customer: credentials.safeCredentials(customer),
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const getWishlist = async function (req, res) {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(200)
        .send({ success: false, message: "Customer ID is required." });

    const customer = await CustomerService.itemWishlist(id);
    res.status(200).send({
      success: true,
      wishlist: customer.wishlist || [],
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

// register manually a customer
const create = async function (req, res) {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).send({ message: "You are not authorized." });

  // Generate random password for users registered manually
  var randomPassword = generator.generate();
  var data = req.body;
  data.password = randomPassword;

  var reg = await Customer.create(data);

  return res.status(200).send({
    message: "success",
    customer: reg,
  });
};

const edit = async function (req, res) {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(200)
        .send({ success: false, message: "Customer ID is required." });

    const result = await CustomerService.update(id, req.body);
    res.status(200).send({
      success: true,
      changes: credentials.safeCredentials(result),
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const remove = async function (req, res) {
  try {
    const { authentication } = req;
    const { id } = req.params;
    if (!authentication || authentication.role !== "Admin")
      return res
        .status(403)
        .send({ success: false, message: "You are not authorized." });
    if (!id)
      return res
        .status(200)
        .send({ success: false, message: "User ID is required." });

    const result = await CustomerService.destroyById(id);
    return res.status(200).send({
      success: true,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  list,
  listById,
  create,
  edit,
  remove,
  getWishlist,
};
