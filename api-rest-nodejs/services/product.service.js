"use strict";
const Product = require("../models/product");

const update = async function (id, body) {
  const updated = await Customer.findByIdAndUpdate(id, {
    names: body.names,
    surnames: body.surnames,
    email: body.email,
    gender: body.gender,
    dni: body.dni,
    password: body.password,
    birthday: body.birthday,
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

const create = async function (body) {
  const product = await Product.create(body);
  if (!product) throw new Error("Error creating product. Try again.");

  return product;
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
  create,
  update,
  item,
  items,
  itemsByFilter,
  destroyById,
};
