const express = require("express");
const req = require("express/lib/request");
const router = express.Router();
const pool = require("../../config/database");

const deleteCarts = router.delete("/", async (req, res) => {
  try {
    console.log("berhasil di delete");
    const { cartId } = req.body;

    const connection = await pool.promise().getConnection();
    const sqlDeleteProduct = `update carts set isDelete = 1,productQuantity = 0 where id = ?`;

    const [result] = await connection.query(sqlDeleteProduct, cartId);

    connection.release();

    res.status(200).send({ message: "data berhasil di hapus" });
  } catch (error) {
    console.log(error);
  }
});
module.exports = { deleteCarts };
