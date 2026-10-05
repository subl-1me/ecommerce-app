"use strict";

require("dotenv");
const jwt = require("jwt-simple");
const moment = require("moment");
const JWT_KEY = process.env.JWT_KEY;

const createToken = function (user) {
  if (!JWT_KEY) throw new Error("Missing JWT KEY.");
  const payload = {
    sub: user._id,
    names: user.names,
    surnames: user.surnames,
    email: user.email,
    role: user.role,
    iat: moment().unix(),
    exp: moment().add(7, "days").unix(),
  };

  return jwt.encode(payload, JWT_KEY);
};

module.exports = {
  createToken,
};
