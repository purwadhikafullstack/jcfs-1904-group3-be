const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const pool = require("../../config/database");
const connection = await pool.promise().getConnection();

const deleteProduct = router.delete("/", async (req, res, next) => {
  try {
    const { productId } = req.body;

    const sqlDeleteProduct = `update products set isDelete = 1 where id = ? ;`;

    const [result] = await connection.query(sqlDeleteProduct, productId);

    connection.release();

    res.status(200).send({ message: "data berhasil di hapus" });
  } catch (error) {
    connection.release();
    next(error);
  }
});

const deleteProductCategoryRouter = router.delete(
  "/category",
  async (req, res, next) => {
    try {
      const { productId, categoryId } = req.body;

      const sqlDeleteProductCategory = `DELETE FROM categories_products where productId = ? and categoryId = ?;`;
      const data = [productId, categoryId];

      const [result] = await connection.query(sqlDeleteProductCategory, data);
      connection.release();

      res.status(200).send({ message: "data berhasil di hapus" });
    } catch (error) {
      connection.release();
      next(error);
    }
  }
);

module.exports = { deleteProductCategoryRouter, deleteProduct };
