"use strict";

const AddressService = require("../services/address.service");
const CustomerService = require("../services/customer.service");

const createAddress = async function (req, res) {
  try {
    const { body } = req;
    if (!body) {
      return res
        .status(200)
        .send({ success: false, message: "Missing address body." });
    }

    const address = await AddressService.add(body);
    // update customer address list
    await CustomerService.insertAddress(body.customer, address);
    return res.status(200).send({ success: true, address });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const removeAddressById = async function (req, res) {
  try {
    const { addressId } = req.params;
    if (!addressId) {
      return res
        .status(200)
        .send({ success: false, message: "Address ID is required." });
    }

    const address = await AddressService.itemById(addressId);
    if (!address) {
      return res
        .status(200)
        .send({ success: false, message: "Address not found." });
    }

    await AddressService.destroy(addressId);
    // remove from customer
    await CustomerService.removeAddress(address._id);

    return res.status(200).send({ success: true });
  } catch (err) {
    return res.status(500).send({
      success: false,
      message: err.message,
    });
  }
};

const setDefaultAddress = async function (req, res) {
  try {
    const { addressId, customerId } = req.params;
    if (!addressId)
      return res
        .status(200)
        .send({ success: false, message: "Address ID is required." });
    if (!customerId)
      return res
        .status(200)
        .send({ success: false, message: "Customer ID is required." });

    const addresses = await AddressService.itemsByCustomerId(customerId);
    if (!addresses.length === 0) {
      return res
        .status(200)
        .send({ sucess: false, message: "Address list is empty." });
    }

    const newDefault = addresses.find(
      (address) => address._id.toString() === addressId,
    );
    const currentDefault = addresses.find((address) => address.default);
    if (currentDefault) {
      await AddressService.toggleDefaultState(currentDefault);
    }
    const address = await AddressService.toggleDefaultState(newDefault);

    return res.status(200).send({ success: true, address });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

const getAddressesByCustomerId = async function (req, res) {
  try {
    const { customerId } = req.params;
    if (!customerId)
      return res
        .status(200)
        .send({ success: false, message: "Customer ID is required." });

    const addresses = await AddressService.itemsByCustomerId(customerId);
    return res.status(200).send({ success: true, addresses });
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message });
  }
};

module.exports = {
  createAddress,
  removeAddressById,
  setDefaultAddress,
  getAddressesByCustomerId,
};
