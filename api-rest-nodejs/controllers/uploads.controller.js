"use strict";
require("dotenv").config();
const uniqid = require("uniqid");
const {
  uploadFromBuffer,
  deleteByPublicId,
} = require("../services/cloudinary.service");

const uploadSingle = async function (req, res) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "File is required." });
    }

    const result = await uploadFromBuffer(req.file.buffer, {
      folder: process.env.CLOUDINARY_FOLDER_NAME,
      public_id: req.file.originalname.split(".")[0],
      overwrite: true,
    });

    res.json({
      success: true,
      image: {
        tempId: uniqid(),
        path: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const uploadMultiple = async function (req, res) {
  try {
    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "Files are required." });
    }

    const files = req.files;
    const uploaderPromises = files.map((file) =>
      uploadFromBuffer(file.buffer, {
        folder: process.env.CLOUDINARY_FOLDER_NAME,
        public_id: file.originalname.split(".")[0],
        overwrite: true,
      }),
    );

    const uploaderResponses = await Promise.all(uploaderPromises);
    res.json({
      success: true,
      uploads: uploaderResponses.map((response) => {
        return {
          tempId: uniqid(),
          path: response.secure_url,
          public_id: response.public_id,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const removeMultipleImg = async function (req, res) {
  try {
    const targets = req.body;
    if (!targets) {
      return res
        .status(400)
        .json({ success: false, error: "File identifiers are required." });
    }
    const deletePromises = targets.map((target) =>
      deleteByPublicId(target.public_id),
    );

    const responses = await Promise.all(deletePromises);
    res.status(200).json({ success: true, results: responses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  removeMultipleImg,
};
