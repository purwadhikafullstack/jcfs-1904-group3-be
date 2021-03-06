const express = require("express");
const router = express.Router();
const pool = require("../../../config/database");

const putApproveWaitingPayment = router.put(
  "/approve/waiting-payment",
  async (req, res, next) => {
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
      next(error);
    }
  }
);

const putRejectWaitingPayment = router.put(
  "/reject/waiting-payment",
  async (req, res, next) => {
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
      next(error);
    }
  }
);

const putFinishPackagingPayment = router.put(
  "/finish/packaging",
  async (req, res, next) => {
    try {
      const { transactionId, items } = req.body;

      const connection = await pool.promise().getConnection();
      const sqlPutFinishPackagingPayment = `UPDATE transactions set status = "delivering" where id = ?;`;

      const [result] = await connection.query(
        sqlPutFinishPackagingPayment,
        transactionId
      );

      connection.release();

      res.status(200).send({ message: "Data telah berhasil di perbarui" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = {
  putApproveWaitingPayment,
  putRejectWaitingPayment,
  putFinishPackagingPayment,
};
