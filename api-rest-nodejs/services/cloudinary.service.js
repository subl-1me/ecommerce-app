const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadFromBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder || "uploads",
        resource_type: options.resourceType || "auto",
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    // create stream to cloudinary
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const deleteByPublicId = (publicId) => {
  return new Promise((resolve, reject) => {
    const response = cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image" },
      (err, result) => {
        if (err) {
          reject(err);
        }

        resolve(result);
      },
    );
  });
};

module.exports = { uploadFromBuffer, deleteByPublicId };
