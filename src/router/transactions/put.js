const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

const putFinishDeliveringPayment = router.put(
  "/finish/delivering",
  async (req, res) => {
    try {
      const { transactionId } = req.body;

      const connection = await pool.promise().getConnection();
      const sqlFinishDeliveringPayment = `UPDATE transactions set status = "completed" where id = ?;`;

      const [result] = await connection.query(
        sqlFinishDeliveringPayment,
        transactionId
      );
      connection.release();

      res.status(200).send({ message: "Data telah berhasil di perbarui" });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = { putFinishDeliveringPayment };
