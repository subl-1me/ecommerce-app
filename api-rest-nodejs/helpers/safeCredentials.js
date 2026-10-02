"use strict";

// filter password
exports.safeCredentials = function (user) {
  const credentials = {
    _id: user._id,
    username: user.username,
    names: user.names,
    surnames: user.surnames,
    profile: user.profile,
    gender: user.gender,
    phone: user.phone,
    email: user.email,
    dni: user.dni | undefined,
    wishlist: user.wishlist,
    notes: user.notes,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return credentials;
};
