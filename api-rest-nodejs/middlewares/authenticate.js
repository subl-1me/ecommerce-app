"use strict";

require("dotenv");
const jwt = require("jwt-simple");
const moment = require("moment");
const JWT_KEY = process.env.JWT_KEY;

exports.auth = function (req, res, next) {
  try {
    if (!req.headers.authorization)
      return res
        .status(403)
        .send({ success: false, message: "Token not found." });

    var token = req.headers.authorization.replace(/['"]+/g, "");
    var segment = token.split(".");

    // invalid token cases
    if (segment.length != 3)
      return res
        .status(403)
        .send({ success: false, message: "Invalid token." });

    const payload = jwt.decode(token, JWT_KEY);
    if (payload.exp < moment().unix)
      return res
        .status(403)
        .send({ success: false, message: "Token expired." });

    req.authentication = payload;
    next();
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};
