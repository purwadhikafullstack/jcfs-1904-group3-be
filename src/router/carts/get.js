const router = require("express").Router();
const pool = require("../../config/database");

const getCarts = router.get("/", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    const { userId } = req.query;
    const sqlpostCart = `SELECT  id as cartId,userId,productId,variantId,productQuantity  FROM carts where userId = ?`;

    const [result] = await connection.query(sqlpostCart, userId);
    connection.release();

    res.status(200).send({ result });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { getCarts };
