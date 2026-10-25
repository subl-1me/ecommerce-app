const Address = require("../models/address");
const Customer = require("../models/customer");

const add = async function (body) {
  const address = await Address.create(body);
  return address;
};

const itemsByCustomerId = async function (customerId) {
  const addresses = await Address.find({
    customer: customerId,
  });

  return addresses;
};

const itemById = async function (id) {
  const address = await Address.findById(id);
  return address;
};

const destroy = async function (id) {
  return await Address.findByIdAndDelete(id);
};

const toggleDefaultState = async function (address) {
  const updateItem = await Address.findByIdAndUpdate(
    address._id,
    {
      default: !address.default,
    },
    { new: true },
  );

  return updateItem;
};

module.exports = {
  add,
  toggleDefaultState,
  itemById,
  itemsByCustomerId,
  destroy,
};
