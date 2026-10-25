"use strict";
const Admin = require("../models/admin");
const bcrypt = require("bcryptjs");
const JWT = require("../helpers/jwt");

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

const create = async function (body) {
  const hash = await bcrypt.hash(body.password, 10);
  if (!hash) {
    return {
      error: true,
      message: "Error hashing password.",
    };
  }

  body.password = hash;
  const admin = await Admin.create(body);
  if (!admin) {
    throw new Error("Error creating admin. Try again.");
  }

  return admin;
};

const itemsByFilter = async function (filter, value) {
  const query = { [filter]: value };
  const items = await Admin.find(query);
  return items;
};

const items = async function () {
  const items = await Customer.find();
  return items;
};

const itemById = async function (id) {
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

const authenticate = async function (typedPassword, admin) {
  const hash = admin.password;
  const auth = await bcrypt.compare(typedPassword, hash);
  if (!auth) {
    throw new Error("Wrong password.");
  }

  return {
    jwt: JWT.createToken(admin),
    auth: true,
  };
};

module.exports = {
  create,
  update,
  destroyById,
  items,
  itemsByFilter,
  destroyById,
  authenticate,
};
