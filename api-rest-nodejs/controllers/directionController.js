"use strict";

const Direction = require("../models/direction");

const addCustomerDirection = async function (req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(200)
        .send({ success: false, message: "Missing address body." });
    }

    const address = await Direction.create(body);
    return res.status(200).send({ success: true, address });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
};

const getDirections = async function (_req, res) {
  try {
    const addresses = await Direction.find();
    return res.status(200).send({ success: true, addresses });
  } catch (err) {
    return res.status(200).send({ message: err.message });
  }
};

const removeDirection = async function (req, res) {
  if (!req.params["directionID"])
    return res.status(200).send({ message: "Direction ID is required." });

  var directionID = req.params["directionID"];

  try {
    await Direction.findByIdAndDelete(directionID);

    return res.status(200).send({ message: "Register deleted successfully." });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error trying to delete direction register." });
  }
};

const setDirectionAsDefault = async function (req, res) {
  if (!req.params["directionID"])
    return res.status(200).send({ message: "Direction ID is required." });
  if (!req.params["customerID"])
    return res.status(200).send({ message: "Customer ID is required." });

  var directionID = req.params["directionID"];
  var customerID = req.params["customerID"];

  try {
    var directions = await Direction.find({ customer: customerID });

    if (!directions)
      return res.status(200).send({ message: "Direction list is empty." });

    for (let direction of directions) {
      await Direction.findByIdAndUpdate(
        { _id: direction._id },
        { principal: false },
      );
      console.log(direction);
    }

    await Direction.findByIdAndUpdate(
      { _id: directionID },
      { principal: true },
    );

    return res
      .status(200)
      .send({ message: "Default direction changed successfully." });
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Error trying to update directions." });
  }
};

const getDefaultDirection = async function (req, res) {
  try {
    const { customerId } = req.params;
    if (!customerId)
      return res
        .status(200)
        .send({ success: false, message: "Customer ID is required." });

    const defaultAddress = await Direction.findOne({
      customer: customerId,
      principal: true,
    });
    return res.status(200).send({ success: true, address: defaultAddress });
  } catch (err) {
    return res.status(500).send({ message: "Error trying to get direction." });
  }
};

module.exports = {
  addCustomerDirection,
  getDirections,
  removeDirection,
  setDirectionAsDefault,
  getDefaultDirection,
};
