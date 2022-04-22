const express = require("express");
const router = express.Router();
const pool = require("../../config/database");

const putCartQuantity = router.put("/", async (req, res) => {
  try {
    const { cartId, productQuantity } = req.body;
    const sqlPutCartQuantity = `UPDATE carts 
    SET productQuantity = ?  Where id = ?;`;

    const data = [productQuantity, cartId];
    const [result] = await connection.query(sqlPutCartQuantity, data);
    connection.release();

    res.status(200).send({ message: "Data telah berhasil di perbarui" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { putCartQuantity };
