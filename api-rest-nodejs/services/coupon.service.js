const Coupon = require("../models/coupon");

const insert = async function (body) {
  const coupon = await Coupon.create(body);
  if (!coupon) {
    throw new Error("Error creating new coupon.");
  }

  return coupon;
};

const items = async function () {
  const coupons = await Coupon.find().populate("addedBy");
  return coupons;
};

const removeItemById = async function (id) {
  await Coupon.findByIdAndDelete(id);
  return;
};

const itemByCode = async function (code) {
  const coupon = await Coupon.findOne({ code });
  return coupon;
};

module.exports = { insert, items, removeItemById, itemByCode };
