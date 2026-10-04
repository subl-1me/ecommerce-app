"use strict";

const Customer = require("../models/customer");
const CustomerService = require("../services/customer.service");
const credentials = require("../helpers/safeCredentials");
const generator = require("../helpers/passwordGenerator");

// get customers list
const list = async function (req, res) {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).send({ message: "You are not authorized." });

  const filterBy = req.query.filterBy;
  var content = req.query.content; // content that user send to search

  var customersArray = [];

  // no filters
  if (filterBy == undefined && content == undefined) {
    customersArray = await Customer.find();

    var safeArray = [];

    //safe user
    customersArray.forEach((cust) => {
      safeArray.push(credentials.safeCredentials(cust));
    });

    res.status(200).send({
      status: "success",
      customers: safeArray,
    });
  }

  content = new RegExp(content, "i");

  if (filterBy == "email") {
    customersArray = await Customer.find({ email: content });
    var safeArray = [];

    //safe user
    customersArray.forEach((cust) => {
      safeArray.push(credentials.safeCredentials(cust));
    });

    if (customersArray.length == 0) {
      res.status(200).send({
        message: "user does not exists",
        status: "error",
      });
    } else {
      res.status(200).send({
        filter: "email",
        customers: safeArray,
      });
    }
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

const item = async function (id) {
  const customer = await Customer.findById(id).populate({
    path: "cart",
    populate: { path: "items" },
  });
  if (!customer) throw new Error("Error trying to create customer.");

  return customer;
};

const remove = async function (req, res) {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).send({ message: "You are not authorized." });
  if (!req.params["id"])
    return res.status(200).send({ message: "An user ID is required." });

  var id = req.params["id"];

  try {
    await Customer.findByIdAndDelete({ _id: id });

    return res.status(200).send({
      status: "success",
    });
  } catch (err) {
    return res.status(400).send({
      status: "error",
      message: "User does not exists.",
    });
  }
};

module.exports = {
  list,
  listById,
  create,
  edit,
  remove,
};
