const connection = require("../../config/database");
const { verify } = require("../../services/token");

const auth = (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log(req.headers);
  const verifiedToken = verify(token);

  const sql = "SELECT * FROM tokens WHERE user_id = ? AND token= ?;";

  const data = [verifiedToken.id, token];

  connection.query(sql, data, (err, result) => {
    if (err) return res.status(500).send({ err });

    if (!result[0])
      return res.status(404).send({ message: "Token is expired" });
  });

  const sqlGetUser = "SELECT * FROM users WHERE id = ?";
  const dataGetUser = verifiedToken.id;

  connection.query(sqlGetUser, dataGetUser, (err, users) => {
    if (err) return res.status(500).send({ err });

    // Jika user tidak ditemukan
    if (!users[0]) return res.status(404).send({ message: "User not found" });

    req.user = users[0];

    next();
  });
};

module.exports = auth;
