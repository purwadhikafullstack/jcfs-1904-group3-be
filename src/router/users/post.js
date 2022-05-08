const express = require("express");
const router = express.Router();
const pool = require("../../config/database");
const bcrypt = require("bcryptjs");
const { sign } = require("../../services/token");

const postRegisterUser = router.post("/register", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    const { username, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password);

    const sqlRegisterUser = "INSERT INTO users SET ?;";
    const dataRegisterUser = [
      { username, email, password: hashedPassword, role: "user" },
    ];

    const [result] = await connection.query(sqlRegisterUser, dataRegisterUser);
    connection.release();

    res.status(200).send({ message: "detail transaction succesfuly added" });
  } catch (error) {
    console.log(error);
  }
});

const postLoginRouter = router.post("/login", async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();

    const { username, password } = req.body;

    const sqlPostLoginRouter =
      "SELECT id,username,password FROM users WHERE username = ?";
    const [result] = await connection.query(sqlPostLoginRouter, username);
    connection.release();

    const user = result[0];

    if (!result.length) {
      return res.status(404).send({ message: "User not found" });
    }
    const compareResult = bcrypt.compareSync(password, result[0].password);

    if (!compareResult) {
      return res.status(401).send({ message: "Wrong password" });
    }
    const token = sign({ id: user.id });

    const sqlInsertToken = "INSERT INTO tokens SET ?;";
    const dataInsertToken = { user_id: user.id, token };

    const [resultToken] = await connection.query(
      sqlInsertToken,
      dataInsertToken
    );

    res.status(200).send({ message: "successfuly login", user, token });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { postRegisterUser, postLoginRouter };
