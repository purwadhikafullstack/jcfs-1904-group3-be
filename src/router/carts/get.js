const router = require("express").Router();
const pool = require("../../config/database");
const auth = require("../../middleware/auth");

const getCarts = router.get("/", auth, async (req, res, next) => {
  try {
    const connection = await pool.promise().getConnection();

    const { userId } = req.query;
    const sqlpostCart = `SELECT  id as cartId,userId,productId,variantId,productQuantity FROM carts where userId = ? and isDelete is NULL;`;

    const [result] = await connection.query(sqlpostCart, userId);
    connection.release();

    res.status(200).send({ result });
  } catch (error) {
    next(error);
  }
});

module.exports = { getCarts };
