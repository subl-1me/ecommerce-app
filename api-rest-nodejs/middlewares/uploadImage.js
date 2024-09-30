"use strict";

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/products");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");

exports.uploadImage = function (req, res, next) {
  upload(req, res, (err) => {
    if (err) return res.status(200).send({ message: "Error saving image." });

    next();
  });
};
