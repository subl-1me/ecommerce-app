"use strict";

require("dotenv").config();
const { constans } = require("../const");
const {
  insertDefaultShippingMethods,
  clear,
} = require("../services/config.service");
const Config = require("../models/config");

const createInitialEcommerceConfig = async function () {
  await clear();
  const shippingMethods = await insertDefaultShippingMethods();

  const testConfig = {
    categories: ["Shirts", "Hats", "Shoes", "Hoddies", "Gloves"],
    shopName: "My Ecommerce Testing",
    shippingMethods,
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

const cleanUp = async function () {
  try {
  } catch (err) {}
};

// const createDefautlShippingMethods = async function () {
//   try {
//     const methods = await insertDefaultShippingMethods();
//     return methods;
//   } catch (err) {
//     console.log(`~ Error creating default shipping methods: ${err.message} ~`);
//   }
// };

module.exports = {
  createInitialEcommerceConfig,
};
