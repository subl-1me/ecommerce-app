"use strict";

const Customer = require("../models/customer");
const Cart = require("../models/cart");
const CustomerService = require("../services/customer.service");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../helpers/jwt");
const credentials = require("../helpers/safeCredentials");
const generator = require("../helpers/passwordGenerator");

const register = async function (req, res) {
  try {
    const data = req.body;
    const customer = await Customer.findOne({
      email: data.email,
    });

    if (customer) {
      return res
        .status(200)
        .send({ success: false, message: "Email already taken." });
    }

    bcrypt.hash(data.password, null, null, async function (err, hash) {
      if (hash) {
        data.password = hash;
        // create cart
        const cart = await Cart.create({ items: [] });
        data.cart = cart._id;
        const customer = await Customer.create(data);

        return res.status(200).send({
          success: true,
          user: customer,
        });
      }
      return res.status(200).send({
        success: false,
        message: err.message,
      });
    });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const login = async function (req, res) {
  const data = req.body;
  const customer = await Customer.findOne({ email: data.email }).populate({
    path: "cart",
    populate: { path: "items", populate: { path: "product" } },
  });
  if (!customer) {
    return res
      .status(200)
      .send({ success: false, message: "Email or Password is not valid." });
  }

  // login
  bcrypt.compare(
    data.password,
    customer.password,
    async function (error, check) {
      if (check) {
        return res.status(200).send({
          success: true,
          customer: credentials.safeCredentials(customer),
          jwt: jwt.createToken(customer),
        });
      } else {
        return res.status(200).send({
          success: false,
          message: error.message,
        });
      }
    },
  );
};

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
  if (!req.params["id"])
    return res.status(200).send({ message: "An user ID is required." });

  var id = req.params["id"];

  //await new Promise(resolve => setTimeout(resolve, 3000));

  try {
    var user = await Customer.findById({ _id: id });

    res.status(200).send({
      status: "success",
      customer: credentials.safeCredentials(user),
    });
  } catch (err) {
    res.status(200).send({
      status: "error",
      message: "User does not exists.",
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
  register,
  login,
  list,
  listById,
  create,
  edit,
  remove,
};
