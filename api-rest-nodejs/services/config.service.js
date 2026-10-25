const ShippingMethod = require("../models/shippingMethod");
const Config = require("../models/config");

const insertDefaultShippingMethods = async function () {
  const shippingMethods = [
    {
      title: "Express",
      time: "1 - 2 business days",
      price: 40,
    },
    {
      title: "Free",
      time: "7 - 10 business days",
      price: 0,
    },
    {
      title: "Standard",
      time: "3 - 5 business days",
      price: 25,
    },
  ];

  const methods = await ShippingMethod.insertMany(shippingMethods);
  return methods;
};

const clear = async function () {
  await ShippingMethod.collection.drop();
  await Config.collection.drop();
};

module.exports = { insertDefaultShippingMethods, clear };
