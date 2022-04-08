const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const { uploadProducts } = require("../services/multer");

const uploadProductImage = uploadProducts.single("image");

const postProduct = router.post("/category", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const { productName } = req.body;

    const sqlPostProductCategory = `INSERT INTO categories_products (productId,categoryId) values(?,?);`;
    const data = [productId, categoryId];
    const [result] = await connection.query(sqlPostProductCategory, data);
    connection.release();

    res.status(200).send({ message: "Data telah berhasil di tambahkan" });
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

const postImageProduct = router.post(
  "/upload",
  uploadProductImage,
  async (req, res) => {
    try {
      const sqlPostImageProduct = `UPDATE products as p
      join variant as v on v.productId = p.id
      SET ? Where productId = ? and v.id = ?;`;
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = { postProductCategory };
