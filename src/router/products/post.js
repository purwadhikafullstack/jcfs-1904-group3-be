const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const { uploadProducts } = require("../services/multer");
const { getProducts } = require("./get");

const uploadProductImage = uploadProducts.single("image");

const postProduct = router.post("/", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const { productName } = req.body;
    const sqlPostProduct = `INSERT INTO products SET productName = ?`;

    const [result] = await connection.query(sqlPostProduct, productName);
    connection.release();

    const sqlGetNewProduct = `SELECT id FROM products ORDER BY id DESC LIMIT 1`;
    const [getProduct] = await connection.query(sqlGetNewProduct);

    res.status(200).send(getProduct[0]);
  } catch (error) {
    console.log(error);
  }
});

const postProductCategory = router.post("/category", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const { productId, categoryId } = req.body;

    const sqlPostProductCategory = `INSERT INTO categories_products (productId,categoryId) values(?,?);`;
    const data = [productId, categoryId];
    const [result] = await connection.query(sqlPostProductCategory, data);
    connection.release();

    res.status(200).send({ message: "Data telah berhasil di tambahkan" });
  } catch (error) {
    console.log(error);
  }
});

const postProductVariant = router.post("/variant", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    const { quantity, productId, color, price, warehouseId } = req.body;

    if (!req.body.size) {
      delete req.body.size;
    }

    delete req.body.quantity;
    delete req.body.productId;

    req.body.warehouseId = parseInt(req.body.warehouseId);

    const qtyTotal = quantity;
    const qtyAvailable = quantity;

    const sqlPostProductVariant = `INSERT INTO variant
    (color, price, warehouseId, qtyTotal, qtyAvailable, productId) values(?,?,?,?,?,?);`;
    const data = [color, price, warehouseId, qtyTotal, qtyAvailable, productId];

    const [resultPost] = await connection.query(sqlPostProductVariant, data);

    const sqlGetVariantsId = `SELECT id FROM variant ORDER BY id DESC LIMIT 1`;

    const [resultGet] = await connection.query(sqlGetVariantsId);

    res
      .status(200)
      .send({ message: "Data telah berhasil di tambahkan", resultGet });
  } catch (error) {
    console.log(error);
  }
});

const postVariantImage = router.post(
  "/variant/image",
  uploadProductImage,
  async (req, res) => {
    try {
      const connection = await pool.promise().getConnection();

      const { id } = req.body;
      const image = `http://localhost:2023/images/products/${req.file.filename}`;

      const sqlPutUserPhoto = `UPDATE variant SET ? WHERE id = ?`;
      const dataPutUserPhoto = [{ image: image }, id];

      const [result] = await connection.query(
        sqlPutUserPhoto,
        dataPutUserPhoto
      );

      res.status(200).send({ message: "Data telah berhasil di tambahkan" });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = {
  postProductCategory,
  postVariantImage,
  postProductVariant,
  postProduct,
};
