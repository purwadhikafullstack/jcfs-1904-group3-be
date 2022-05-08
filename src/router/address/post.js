const router = require("express").Router();
const pool = require("../../config/database");
const auth = require("../../middleware/auth");

const postAddress = router.post("/", auth, async (req, res) => {
  try {
    const connection = await pool.promise().getConnection();
    const {
      province,
      city,
      district,
      urban_village,
      postal_code,
      detail_address,
    } = req.body;
    const sqlPostAddress = `INSERT INTO address SET ?`;
    const dataPostAddress = {
      province,
      city,
      district,
      urban_village,
      postal_code,
      detail_address,
    };

    const [result] = await connection.query(sqlPostAddress, dataPostAddress);
    connection.release();

    res.status(200).send({ addressId: result.insertId });
  } catch (error) {
    console.log(error);
  }
});

module.exports = { postAddress };
