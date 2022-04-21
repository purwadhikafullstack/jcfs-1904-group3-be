const router = require("express").Router();
const pool = require("../../config/database");

const postCart = router.post("/", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const { userId, productId, productQuantity, variantId } = req.body;

    const sqlCheckCart = `SELECT * from carts where productId = ? and userId = ? and variantId = ?; `;

    const dataSqlCheckCart = [productId, userId, variantId];
    const [check] = await connection.query(sqlCheckCart, dataSqlCheckCart);
    if (check.length) {
      const cartId = check[0].id;
      const updateQuantity = check[0].productQuantity + 1;

      const sqlPutCartQuantity = `UPDATE carts 
      SET productQuantity = ? Where id = ?;`;
      const dataSqlPutCartQuantity = [updateQuantity, cartId];

      const [result] = await connection.query(
        sqlPutCartQuantity,
        dataSqlPutCartQuantity
      );
      connection.release();
      res.status(200).send({ message: "item succesfuly added to cart" });
    }

    if (!check.length) {
      const sqlpostCart = `INSERT INTO carts SET ?`;

      const dataSqlPostCart = { userId, productId, productQuantity, variantId };

      const [result] = await connection.query(sqlpostCart, dataSqlPostCart);
      connection.release();

      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = { postCart };
