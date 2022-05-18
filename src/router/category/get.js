const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

const getCategory = router.get("/", async (req, res, next) => {
  const connection = await pool.promise().getConnection();
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
