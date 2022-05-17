const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const { uploadProducts } = require("../../services/multer");
require("dotenv").config();

const uploadProductImage = uploadProducts.single("image");

const postProduct = router.post("/", async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();
    const { addedProductName } = req.body;

    const sqlPostProduct = `INSERT INTO products SET productName = ?`;

    const [result] = await connection.query(sqlPostProduct, addedProductName);

    const sqlGetNewProduct = `SELECT id FROM products ORDER BY id DESC LIMIT 1`;
    const [getProduct] = await connection.query(sqlGetNewProduct);

    connection.release();

    res.status(200).send(getProduct[0]);
  } catch (error) {
    next(error);
  }
});

const postProductCategory = router.post("/category", async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();
    const { productId, categoryId } = req.body;

    const sqlPostProductCategory = `INSERT INTO categories_products (productId,categoryId) values(?,?);`;
    const data = [productId, categoryId];
    const [result] = await connection.query(sqlPostProductCategory, data);
    connection.release();

    res.status(200).send({ message: "Data telah berhasil di tambahkan" });
  } catch (error) {
    next(error);
  }
});

const postProductVariant = router.post("/variant", async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const { quantity, productId, color, price, warehouseId, size } = req.body;

    if (!req.body.size) {
      delete req.body.size;
    }

    delete req.body.quantity;
    delete req.body.productId;

    req.body.warehouseId = parseInt(req.body.warehouseId);

    const qtyTotal = quantity;
    const qtyAvailable = quantity;

    var sqlPostProductVariant = `INSERT INTO variant
    (color, price, warehouseId, qtyTotal, qtyAvailable, productId) values(?,?,?,?,?,?);`;

    var data = [color, price, warehouseId, qtyTotal, qtyAvailable, productId];

    if (req.body.size) {
      sqlPostProductVariant = `INSERT INTO variant
    (color, price, warehouseId, qtyTotal, qtyAvailable, productId,size) values(?,?,?,?,?,?,?);`;
      var data = [
        color,
        price,
        warehouseId,
        qtyTotal,
        qtyAvailable,
        productId,
        size,
      ];
    }

    const [resultPost] = await connection.query(sqlPostProductVariant, data);

    const sqlGetVariantsId = `SELECT id FROM variant ORDER BY id DESC LIMIT 1`;

    const [resultGet] = await connection.query(sqlGetVariantsId);

    res
      .status(200)
      .send({ message: "Data telah berhasil di tambahkan", resultGet });
  } catch (error) {
    next(error);
  }
});

const postVariantImage = router.post(
  "/variant/image",
  uploadProductImage,
  async (req, res, next) => {
    try {
      const connection = await pool.promise().getConnection();

      const { id } = req.body;
      const image = `${process.env.API_URL}/images/products/${req.file.filename}`;

      const sqlPutUserPhoto = `UPDATE variant SET ? WHERE id = ?`;
      const dataPutUserPhoto = [{ image: image }, id];

      const [result] = await connection.query(
        sqlPutUserPhoto,
        dataPutUserPhoto
      );

      res.status(200).send({ message: "Data telah berhasil di tambahkan" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = {
  postProductCategory,
  postVariantImage,
  postProductVariant,
  postProduct,
};
