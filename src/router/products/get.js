const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const Dummy = require("../../../dummy");

const getProducts = router.get("/", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetProductList = `SELECT p.id AS productId,
    p.productName,
    v.warehouseId,
    v.id As variantId,
    v.color as variant,
    v.size,
    v.price,
    v.image,
    v.qtyAvailable,
    v.qtyTotal FROM products as p
    JOIN variant as v ON v.productId = p.id
  	GROUP BY p.id;`;

    const [result] = await connection.query(sqlGetProductList);
    connection.release();

    // const productsMapped = result.map((value) => {
    //   const copiedId = 0;
    //   if (id != copiedId) {
    //   }
    // });

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = getProducts;
