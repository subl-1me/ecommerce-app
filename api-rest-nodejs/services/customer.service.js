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

module.exports = {
  update,
};
