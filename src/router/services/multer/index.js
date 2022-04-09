const multer = require("multer");
const path = require("path");

const photoDirectoryProducts = path.join(
  __dirname,
  "../../../../public/images/products"
);

const storageProducts = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, photoDirectoryProducts);
  },
  filename: function (req, file, cb) {
    cb(null, `test-photo.png`);
  },
});

const uploadProducts = multer({
  storage: storageProducts,
  limits: {
    filesize: 10000000,
  },
  fileFilter(req, file, cb) {
    cb(null, true);
  },
});

module.exports = { uploadProducts };
