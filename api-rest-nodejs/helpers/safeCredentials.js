"use strict";

// filter password
const safeCredentials = (user) => {
  const simplifyProduct = () => {
    return {
      _id: user.cart._id,
      items: user.cart.items.map((item) => {
        return {
          amount: item.amount,
          size: item.size,
          product: {
            _id: item.product._id,
            category: item.product.category,
            title: item.product.title,
            gallery: item.product.gallery,
            price: item.product.price,
          },
        };
      }),

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  };

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
    cart: user.cart ? simplifyProduct(user.cart) : undefined,
    wishlist: user.wishlist,
    notes: user.notes,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };

  return credentials;
};

const safeAdmin = (admin) => {
  return {
    _id: admin._id,
    username: admin.username,
    email: admin.email,
    role: admin.role,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
  };
};

module.exports = {
  safeCredentials,
  safeAdmin,
};
