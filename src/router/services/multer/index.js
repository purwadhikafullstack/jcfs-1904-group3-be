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
    file.originalname;
    const split = file.originalname.split(".")[0];
    const ext = file.mimetype.split("/")[1];

    cb(null, `${split}-${Date.now()}.${ext}`);
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
