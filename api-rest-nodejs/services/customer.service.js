"use strict";
const Customer = require("../models/customer");

const update = async function (id, body) {
  const updated = await Customer.findByIdAndUpdate(id, {
    names: body.names,
    surnames: body.surnames,
    email: body.email,
    gender: body.gender,
    dni: body.dni,
    password: body.password,
    birthday: body.birthday,
    addresses: body.addresses,
    country: body.country,
    cart: body.cart,
    wishlist: body.wishlist,
    phone: body.phone,
    notes: body.notes,
    city: body.city,
  }).populate({
    path: "cart",
    populate: { path: "items", populate: { path: "product" } },
  });

  return updated;
};

const itemsByFilter = async function (filter, value) {
  const query = { [filter]: value };
  const items = await Customer.find(query);
  return items;
};

const insertAddress = async function (customerId, address) {
  const updatedItem = await Customer.findByIdAndUpdate(
    customerId,
    {
      $push: {
        addresses: address,
      },
    },
    { new: true },
  );
  return updatedItem;
};

const removeAddress = async function (customerId, addressId) {
  const updatedItem = await Customer.findByIdAndUpdate(
    customerId,
    {
      $pull: {
        addresses: addressId,
      },
    },
    { new: true },
  );
  return updatedItem;
};

const items = async function () {
  const items = await Customer.find();
  return items;
};

const item = async function (id) {
  const customer = await Customer.findById(id).populate({
    path: "cart",
    populate: { path: "items" },
  });
  if (!customer) throw new Error("Error trying to create customer.");

  return customer;
};

const destroyById = async function (id) {
  const result = await Customer.findByIdAndDelete(id);
  return result;
};

module.exports = {
  update,
  item,
  items,
  itemsByFilter,
  destroyById,
  insertAddress,
  removeAddress,
};
