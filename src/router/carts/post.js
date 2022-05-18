const router = require("express").Router();
const pool = require("../../config/database");
const auth = require("../../middleware/auth");
const connection = await pool.promise().getConnection();

const postCart = router.post("/", auth, async (req, res, next) => {
  try {
    const { userId, productId, productQuantity, variantId } = req.body;
    // checking if there is a cart with the same product,variant,userid and isDelete Null
    const sqlCheckCart = `SELECT * from carts where productId = ? and userId = ? and variantId = ? and isDelete is NULL; `;

    const dataSqlCheckCart = [productId, userId, variantId];
    const [check] = await connection.query(sqlCheckCart, dataSqlCheckCart);

    // if the checking true
    if (check.length) {
      // update the quantity of the carts
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
    } else {
      //if the checking false create new cart

      const sqlpostCart = `INSERT INTO carts SET ?`;

      const dataSqlPostCart = {
        userId,
        productId,
        productQuantity,
        variantId,
      };

      const [result] = await connection.query(sqlpostCart, dataSqlPostCart);
      connection.release();

      res.status(200).send(result);
    }
  } catch (error) {
    connection.release();
    next(error);
  }
});

module.exports = { postCart };
