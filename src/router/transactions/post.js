const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

const postWaitingPaymentTransaction = router.post(
  "/waiting-payment",
  async (req, res) => {
    try {
      const connection = await pool.promise().getConnection();
      const { totalAmount, userId } = req.body;
      const sqlPostWaitingPaymentTransaction = `INSERT INTO transactions (userId,totalAmount,status) values(?,?,?);`;
      const dataWaitingPaymentTransaction = [
        userId,
        totalAmount,
        "waiting payment",
      ];
      3;
      const [result] = await connection.query(
        sqlPostWaitingPaymentTransaction,
        dataWaitingPaymentTransaction
      );
      connection.release();

      res.status(200).send({
        message: "transaction succesfuly created",
        transactionId: result.insertId,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const postDetailTransaction = router.post("/detail", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const { carts, transactionId } = req.body;
    console.log(transactionId);
    const mappingCarts = () => {
      var values = ``;
      carts.forEach((value, index) => {
        if (!value.size) {
          values += `(${transactionId},"${value.productName}",${value.price},"${value.variant}",null,${value.productQuantity},"${value.image}")`;
        }
        if (value.size) {
          values += `(${transactionId},"${value.productName}",${value.price},"${value.variant}","${value.size}",${value.productQuantity},"${value.image}")`;
        }
        if (carts.length - 1 != index) {
          values += `,`;
        }
      });
      return values;
    };
    const sqlPostDetailTransaction = `INSERT INTO detailtransactions (transactionId,productName,productPrice,productColor,productSize,quantity,productImage) values${mappingCarts()};`;

    const [result] = await connection.query(sqlPostDetailTransaction);
    connection.release();

    res.status(200).send({ message: "detail transaction succesfuly added" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { postWaitingPaymentTransaction, postDetailTransaction };
