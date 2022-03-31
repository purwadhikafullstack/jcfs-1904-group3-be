const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

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

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
});

const getVariantsProducts = router.get("/:productId", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    const productId = req.params.productId;

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
    Where p.id = ?;`;

    const [result] = await connection.query(sqlGetProductList, productId);
    connection.release();

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { getProducts, getVariantsProducts };
