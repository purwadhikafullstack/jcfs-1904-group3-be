const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const pool = require("../../config/database");
const auth = require("../../middleware/auth");

const deleteCarts = router.delete("/", auth, async (req, res, next) => {
  const connection = await pool.promise().getConnection();
  try {
    const { cartId } = req.body;

    const sqlDeleteProduct = `update carts set isDelete = 1,productQuantity = 0 where id = ?`;

    const [result] = await connection.query(sqlDeleteProduct, cartId);

    connection.release();

    res.status(200).send({ message: "data berhasil di hapus" });
  } catch (error) {
    connection.release();
    next(error);
  }
});

const deleteCartWhenCheckout = router.delete(
  "/checkout",
  async (req, res, next) => {
    const connection = await pool.promise().getConnection();
    try {
      // delete cart when the item successfuly checkout
      // idCarts is an array of object consisting the cart that recently just got checkout
      const { idCarts } = req.body;

      const sqlDeleteCartWhenCheckout = `update carts set isDelete = 1,productQuantity = 0 where id in(?)`;
      const dataDeleteCartWhenCheckout = [idCarts];

      const [result] = await connection.query(
        sqlDeleteCartWhenCheckout,
        dataDeleteCartWhenCheckout
      );

      connection.release();

      res.status(200).send({ message: "data berhasil di hapus" });
    } catch (error) {
      connection.release();
      next(error);
    }
  }
);
module.exports = { deleteCarts, deleteCartWhenCheckout };
