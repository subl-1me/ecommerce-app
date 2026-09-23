"use strict";

const express = require("express");
const uploadController = require("../controllers/uploads.controller");
const upload = require("../config/multer");
const routes = express.Router();

routes.post(
  "/upload-single",
  upload.single("image"),
  uploadController.uploadSingle,
);
routes.post(
  "/upload-multiple",
  upload.array("image", 5),
  uploadController.uploadMultiple,
);
routes.post("/remove-multiple-img", uploadController.removeMultipleImg);

module.exports = routes;
