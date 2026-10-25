"use strict";

const { safeAdmin } = require("../helpers/safeCredentials");
const Admin = require("../models/admin");
const AdminService = require("../services/admin.service");

const register = async function (req, res) {
  try {
    const { body } = req;
    // Check if email or username are already taken
    const props = ["email", "username"];
    const promises = props.map((prop) =>
      AdminService.itemsByFilter(prop, body[prop]),
    );
    const results = await Promise.all(promises);
    if (results[0].length > 0) {
      return res.status(200).send({
        success: false,
        message: "Email or Username already taken.",
      });
    }

    const response = await AdminService.create(body);
    if (response.error) {
      return res.status(200).send({
        success: false,
        message: response.message,
      });
    }

    return res.status(200).send({
      success: true,
    });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const login = async function (req, res) {
  try {
    const { body } = req;
    // check if exists
    const results = await AdminService.itemsByFilter("email", body.email);
    const admin = results.find((admin) => admin.email === body.email);
    if (!admin) {
      return res
        .status(404)
        .send({ success: false, message: "User doesn't exist." });
    }

    const response = await AdminService.authenticate(body.password, admin);
    return res.status(200).send({
      success: true,
      auth: response.auth,
      jwt: response.jwt,
      admin: safeAdmin(admin),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  register,
  login,
};
