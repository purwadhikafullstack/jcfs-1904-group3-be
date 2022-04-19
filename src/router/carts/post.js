const router = require("express").Router();
const pool = require("../../config/database");

const postCart = router.post("/", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const { userId, productId, productQuantity, variantId } = req.body;
    const sqlpostCart = `INSERT INTO carts SET ?`;

    const data = { userId, productId, productQuantity, variantId };

    const [result] = await connection.query(sqlpostCart, data);
    connection.release();

    res.status(200).send(result);
  } catch (error) {
    console.log(error);
  }
});

module.exports = { postCart };
