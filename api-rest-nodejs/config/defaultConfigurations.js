"use strict";

require("dotenv").config();
const { constans } = require("../const");
const Config = require("../models/config");

const createInitialEcommerceConfig = async function () {
  const testConfig = {
    categories: ["Shirts", "Hats", "Shoes", "Hoddies", "Gloves"],
    shopName: "My Ecommerce Testing",
    logo: {
      public_id: constans.defaultLogo.public_id,
      path: constans.defaultLogo.path,
    },
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
