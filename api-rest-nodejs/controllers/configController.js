"use strict";

const Config = require("../models/config");
const { constans } = require("../const");
const { getByTag } = require("../services/cloudinary.service");

const {
  createInitialEcommerceConfig,
} = require("../config/defaultConfigurations");

const update = async function (req, res) {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).send({ message: "You are not authorized." });
  if (!req.params["id"])
    return res.status(200).send({ message: "Config ID is required" });

  var params = req.body;
  var configID = req.params["id"];

  try {
    var updatedConfig = await Config.findByIdAndUpdate(configID, {
      categories: params.categories,
      shopName: params.shopName,
      logo: params.logo,
      serie: params.serie,
      correlation: params.correlation,
    });
    return res
      .status(200)
      .send({ success: true, message: "Config updated successfully." });
  } catch (err) {
    return res
      .status(500)
      .send({ success: false, message: "Error updating config." });
  }
};

const addCategory = async function (req, res) {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).send({ message: "You are not authorized." });
  if (!req.params["id"])
    return res.status(200).send({ message: "Config ID is required" });

  var configID = req.params["id"];
  var category = req.body["name"];

  try {
    var updatedConfig = await Config.updateOne(
      { _id: configID },
      { $push: { categories: category } },
    );

    return res.status(200).send({ message: "Category Added." });
  } catch (err) {
    return res.status(500).send({ message: "Server Error." });
  }
};

const removeCategory = async function (req, res) {
  if (!req.user || req.user.role !== "Admin")
    return res.status(403).send({ message: "You are not authorized." });
  if (!req.params["id"])
    return res.status(200).send({ message: "Config ID is required" });
  if (!req.params["categoryName"])
    return res.status(200).send({ message: "Category name is required" });

  var categoryName = req.params["categoryName"];
  var configID = req.params["id"];

  try {
    var updatedConfig = await Config.updateOne(
      { _id: configID },
      { $pull: { categories: categoryName } },
    );

    return res.status(200).send({ message: "Category deleted." });
  } catch (err) {
    return res.status(200).send({ message: "Server Error" });
  }
};

const getConfig = async function (_req, res) {
  try {
    var actualConfig = await Config.find({ identifier: 1 });

    return res.status(200).send({ success: true, config: actualConfig[0] });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

// This method will only be activated once
const createInitialConfig = async function (_req, res) {
  const creation = await createInitialEcommerceConfig();
  return res.status(200).send({ response: creation });
};

module.exports = {
  createInitialConfig,
  getConfig,
  update,
  addCategory,
  removeCategory,
};
