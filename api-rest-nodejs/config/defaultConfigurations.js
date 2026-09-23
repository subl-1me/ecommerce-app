"use strict";

const Config = require("../models/config");

const createInitialEcommerceConfig = async function () {
  const testConfig = {
    categories: ["Shirts", "Hats", "Shoes", "Hoddies", "Gloves"],
    shopName: "My Ecommerce Testing",
    logo: "test",
    serie: "000",
    correlation: "000001",
  };

  const createRes = await Config.create(testConfig);
  console.log(createRes);
  if (!createRes)
    return {
      success: false,
      message: "Error trying to create default config",
      response: createRes,
    };

  return {
    success: true,
  };
};

module.exports = {
  createInitialEcommerceConfig,
};
