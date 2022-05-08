const express = require("express");
const router = express.Router();
const pool = require("../../../config/database");

const putApproveWaitingPayment = router.put(
  "/approve/waiting-payment",
  async (req, res) => {
    try {
      const { transactionId } = req.body;

      const connection = await pool.promise().getConnection();
      const sqlApprovePutWaitingPayment = `UPDATE transactions set status = "packaging" where id = ?;`;

      const [result] = await connection.query(
        sqlApprovePutWaitingPayment,
        transactionId
      );
      connection.release();

      res.status(200).send({ message: "Data telah berhasil di perbarui" });
    } catch (error) {
      console.log(error);
    }
  }
);

const putRejectWaitingPayment = router.put(
  "/reject/waiting-payment",
  async (req, res) => {
    try {
      const { transactionId } = req.body;

      const connection = await pool.promise().getConnection();
      const sqlPutRejectPayment = `UPDATE transactions set status = "rejected" where id = ?;`;

      const [result] = await connection.query(
        sqlPutRejectPayment,
        transactionId
      );
      connection.release();

      res.status(200).send({ message: "Data telah berhasil di perbarui" });
    } catch (error) {
      console.log(error);
    }
  }
);

const putFinishPackagingPayment = router.put(
  "/finish/packaging",
  async (req, res) => {
    try {
      const { transactionId, items } = req.body;

      const connection = await pool.promise().getConnection();
      const sqlPutFinishPackagingPayment = `UPDATE transactions set status = "delivering" where id = ?;`;

      const [result] = await connection.query(
        sqlPutFinishPackagingPayment,
        transactionId
      );
      items.filter(async (value) => {
        const sqlUpdateStock = `UPDATE products join variant on products.id = variant.productId 
        set qtyAvailable=qtyavailable-?
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
      console.log(error);
    }
  }
);

module.exports = {
  putApproveWaitingPayment,
  putRejectWaitingPayment,
  putFinishPackagingPayment,
};
