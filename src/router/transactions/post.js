const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

const postCheckoutCartToTransaction = router.post("/", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const { totalAmount, userId } = req.body;
    const sqlPostCheckoutCartToTransaction = `INSERT INTO transactions (userId,totalAmount,status) values(?,?,?);`;
    const dataCheckoutCartToTransaction = [
      userId,
      totalAmount,
      "waiting payment",
    ];
    const [result] = await connection.query(
      sqlPostCheckoutCartToTransaction,
      dataCheckoutCartToTransaction
    );
    connection.release();

    res.status(200).send(getProduct[0]);
  } catch (error) {
    console.log(error);
  }
});
