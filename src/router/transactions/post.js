const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const auth = require("../../middleware/auth");

const { uploadPaymentEvidence } = require("../../services/multer");

const multerUploadPaymentEvidence = uploadPaymentEvidence.single("image");

const postWaitingPaymentTransaction = router.post(
  "/waiting-payment",
  auth,
  async (req, res, next) => {
    try {
      const connection = await pool.promise().getConnection();
      const { totalAmount, userId, addressId, carts } = req.body;
      const setRejectPayment = async (transactionId) => {
        const sqlPutRejectPayment = `UPDATE transactions set status = "rejected" where id = ? and status="waiting payment";`;

        const [rejectPayment] = await connection.query(
          sqlPutRejectPayment,
          transactionId
        );
        if (rejectPayment.insertId) {
          carts.filter(async (value) => {
            const sqlUpdateStock = `UPDATE products join variant on products.id = variant.productId 
              set qtyAvailable=qtyavailable+?
              where variant.id = ?;`;
            const dataUpdateStock = [value.productQuantity, value.variantId];
            const [updateStock] = await connection.query(
              sqlUpdateStock,
              dataUpdateStock
            );
          });
        }
      };
      var checkedStock;

      for (var i = 0; i < carts.length; i++) {
        const sqlCheckStock = `select qtyAvailable from variant where id = ?`;
        const dataCheckStock = carts[i].variantId;
        const [stock] = await connection.query(sqlCheckStock, dataCheckStock);

        if (carts[i].productQuantity > stock[0].qtyAvailable) {
          checkedStock = false;
          break;
        }
        checkedStock = true;
      }

      if (checkedStock) {
        const sqlPostWaitingPaymentTransaction = `INSERT INTO transactions (userId,addressId,totalAmount,status) values(?,?,?,?);`;
        const dataWaitingPaymentTransaction = [
          userId,
          addressId,
          totalAmount,
          "waiting payment",
        ];
        3;
        const [transaction] = await connection.query(
          sqlPostWaitingPaymentTransaction,
          dataWaitingPaymentTransaction
        );

        carts.filter(async (value) => {
          const sqlUpdateStock = `UPDATE products join variant on products.id = variant.productId 
          set qtyAvailable=qtyavailable-?
          where variant.id = ?;`;
          const dataUpdateStock = [value.productQuantity, value.variantId];
          const [updateStock] = await connection.query(
            sqlUpdateStock,
            dataUpdateStock
          );
        });
        var dayInMilliseconds = 1000 * 60 * 60 * 24;
        setTimeout(() => {
          setRejectPayment(transaction.insertId);
        }, dayInMilliseconds);

        connection.release();

        res.status(200).send({
          message: "transaction succesfuly created",
          transactionId: transaction.insertId,
        });
      }
      if (!checkedStock) {
        res.status(400).send({
          message: "Product is unavailable",
        });
      }
    } catch (error) {
      next(error);
    }
  }
);

const postDetailTransaction = router.post(
  "/detail",
  auth,
  async (req, res, next) => {
    try {
      const connection = await pool.promise().getConnection();
      const { carts, transactionId } = req.body;

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
      next(error);
    }
  }
);
const postPaymentEvidence = router.post(
  "/evidence/payment",
  auth,
  multerUploadPaymentEvidence,
  async (req, res, next) => {
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
      next(error);
    }
  }
);

module.exports = {
  postWaitingPaymentTransaction,
  postDetailTransaction,
  postPaymentEvidence,
};
