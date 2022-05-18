const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

const auth = require("../../middleware/auth");
const connection = await pool.promise().getConnection();

const putFinishDeliveringPayment = router.put(
  "/finish/delivering",
  auth,
  async (req, res, next) => {
    try {
      const { transactionId, items } = req.body;

      const sqlFinishDeliveringPayment = `UPDATE transactions set status = "completed" where id = ?;`;

      const [result] = await connection.query(
        sqlFinishDeliveringPayment,
        transactionId
      );

      items.filter(async (value) => {
        const sqlUpdateStock = `UPDATE products join variant on products.id = variant.productId 
        set qtyTotal=qtyTotal-?
        where productName=? and color=?;`;
        const dataUpdateStock = [
          value.quantity,
          value.productName,
          value.productColor,
        ];
        const [result] = await connection.query(
          sqlUpdateStock,
          dataUpdateStock
        );
      });

      connection.release();

      res.status(200).send({ message: "Data telah berhasil di perbarui" });
    } catch (error) {
      connection.release();
      next(error);
    }
  }
);

module.exports = { putFinishDeliveringPayment };
