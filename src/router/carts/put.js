const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const auth = require("../../middleware/auth");
const connection = await pool.promise().getConnection();

const putCartQuantity = router.put("/", auth, async (req, res, next) => {
  try {
    const { cartId, productQuantity } = req.body;
    const sqlPutCartQuantity = `UPDATE carts 
    SET productQuantity = ?  Where id = ?;`;

    const data = [productQuantity, cartId];
    const [result] = await connection.query(sqlPutCartQuantity, data);
    connection.release();

    res.status(200).send({ message: "Data telah berhasil di perbarui" });
  } catch (error) {
    connection.release();
    next(error);
  }
});

module.exports = { putCartQuantity };
