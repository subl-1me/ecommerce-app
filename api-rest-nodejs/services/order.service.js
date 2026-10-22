const Order = require("../models/order");

const insert = async function (body) {
  const order = await Order.create(body);
  return order;
};

const getItemsByCustomerId = async function (id) {
  // should have only 1 active order per cart
  const orders = await Order.find({ customer: id });
  return orders;
};

const confirmItem = async function (id) {
  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    {
      paymentStatus: "succeeded",
      paidAt: new Date(),
    },
    { new: true },
  );

  return updatedOrder;
};

const itemById = async function (id) {
  const order = await Order.findById(id).populate({
    path: "items",
    populate: { path: "product" },
  });
  return order;
};

module.exports = {
  insert,
  getItemsByCustomerId,
  confirmItem,
  itemById,
};
