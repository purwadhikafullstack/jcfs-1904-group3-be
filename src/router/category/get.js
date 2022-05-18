const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const connection = await pool.promise().getConnection();

const getCategory = router.get("/", async (req, res, next) => {
  try {
    const sqlGetProductCategory = ` SELECT id,categoryName from categories;`;

    const [result] = await connection.query(sqlGetProductCategory);
    connection.release();

    res.status(200).send({ result });
  } catch (error) {
    connection.release();
    next(error);
  }
});

module.exports = { getCategory };
