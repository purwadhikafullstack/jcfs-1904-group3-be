const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const connection = await pool.promise().getConnection();

const putProductRouter = router.put("/", async (req, res, next) => {
  try {
    const { productData, productId, variantId } = req.body;
    const { productName, color, price, qtyTotal, qtyAvailable } = productData;
    const sqlPutProduct = `UPDATE products as p
    join variant as v on v.productId = p.id
    SET ? Where productId = ? and v.id = ?;`;

    const data = [
      { productName, color, price, qtyTotal, qtyAvailable },
      productId,
      variantId,
    ];
    const [result] = await connection.query(sqlPutProduct, data);
    connection.release();

    res.status(200).send({ message: "Data telah berhasil di perbarui" });
  } catch (error) {
    connection.release();
    next(error);
  }
});

module.exports = { putProductRouter };
