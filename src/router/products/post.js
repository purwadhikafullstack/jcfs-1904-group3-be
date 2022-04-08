const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

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

module.exports = { postProductCategory };
