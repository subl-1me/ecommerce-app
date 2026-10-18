"use strict";

const Coupon = require("../models/coupon");
const CouponService = require("../services/coupon.service");

const add = async function (req, res) {
  try {
    const { authentication } = req;
    if (!authentication || authentication.role !== "Admin")
      return res
        .status(403)
        .send({ success: false, message: "You are not authorized." });

    const coupon = await CouponService.insert(req.body);
    return res.status(200).send({ success: true, coupon });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const coupons = async function (req, res) {
  try {
    const { authentication } = req;
    if (!authentication || authentication.role !== "Admin")
      return res
        .status(403)
        .send({ success: false, message: "You are not authorized." });

    const coupons = await CouponService.items();
    return res.status(200).send({ success: true, coupons });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const removeById = async function (req, res) {
  try {
    const { authentication } = req;
    const { id } = req.params;
    if (!authentication || authentication.role !== "Admin")
      return res
        .status(403)
        .send({ success: false, message: "You are not authorized." });

    if (!id)
      return res
        .status(200)
        .send({ success: false, message: "Coupon ID is required." });

    await CouponService.removeItemById(id);
    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const couponByCode = async function (req, res) {
  try {
    const { code } = req.params;
    if (!code)
      return res
        .status(200)
        .send({ success: false, message: "Coupon code is required." });

    const coupon = await CouponService.itemByCode(code);
    return res.status(200).send({ success: true, coupon });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  add,
  coupons,
  removeById,
  couponByCode,
};
