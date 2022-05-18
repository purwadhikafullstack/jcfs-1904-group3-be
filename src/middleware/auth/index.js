const pool = require("../../config/database");
const { verify } = require("../../services/token");
const connection = await pool.promise().getConnection();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");
    const verifiedToken = verify(token);

    const sqlVerifyToken =
      "SELECT * FROM tokens WHERE user_id = ? AND token = ?;";
    const dataVerifyToken = [verifiedToken.id, token];
    const [resultToken] = await connection.query(
      sqlVerifyToken,
      dataVerifyToken
    );

    if (!resultToken[0])
      return res.status(404).send({ message: "Token is expired" });

    const sqlGetUser = "SELECT * FROM users WHERE id = ?";

    const [resultUser] = await connection.query(sqlGetUser, verifiedToken.id);
    connection.release();
    if (!resultUser[0])
      return res.status(404).send({ message: "User not found" });

    next();
  } catch (error) {
    connection.release();
    console.log(error);
  }
};

module.exports = auth;
