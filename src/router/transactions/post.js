const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const auth = require("../../middleware/auth");

const { uploadPaymentEvidence } = require("../../services/multer");

const multerUploadPaymentEvidence = uploadPaymentEvidence.single("image");

const postWaitingPaymentTransaction = router.post(
  "/waiting-payment",
  auth,
  async (req, res) => {
    try {
      const connection = await pool.promise().getConnection();
      const { totalAmount, userId, addressId } = req.body;
      const sqlPostWaitingPaymentTransaction = `INSERT INTO transactions (userId,addressId,totalAmount,status) values(?,?,?,?);`;
      const dataWaitingPaymentTransaction = [
        userId,
        addressId,
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

const postDetailTransaction = router.post("/detail", auth, async (req, res) => {
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
const postPaymentEvidence = router.post(
  "/evidence/payment",
  auth,
  multerUploadPaymentEvidence,
  async (req, res) => {
    try {
      const connection = await pool.promise().getConnection();

      const { transactionId } = req.body;
      const image = `http://localhost:2023/images/payment/${req.file.filename}`;

      const sqlPutUserPhoto = `UPDATE transactions SET ? WHERE id = ?`;
      const dataPutUserPhoto = [
        { paymentEvidence: image, status: "waiting confirmation" },
        parseInt(transactionId),
      ];

      const [result] = await connection.query(
        sqlPutUserPhoto,
        dataPutUserPhoto
      );

      res.status(200).send({ message: "Data telah berhasil di tambahkan" });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = {
  postWaitingPaymentTransaction,
  postDetailTransaction,
  postPaymentEvidence,
};
