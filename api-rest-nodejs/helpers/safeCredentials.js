"use strict";

// filter password
exports.safeCredentials = function (user) {
  var credentials = {
    sub: user._id,
    names: user.names,
    surnames: user.surnames,
    profile: user.profile,
    gender: user.gender,
    phone: user.phone,
    email: user.email,
    dni: user.dni | undefined,
    notes: user.notes,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return credentials;
};
