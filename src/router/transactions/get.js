const router = require("express").Router();
const pool = require("../../config/database");

const getTransactionSumPerMonth = router.get(
  "/sum/per-month",
  async (req, res) => {
    try {
      const connection = await pool.promise().getConnection();
      const { year, method } = req.query;
      const addedMethodQuery = ` ${method}(created_at);`;
      var sqlgetTransactionSumPerMonth = `select created_at as Date , sum(totalAmount) as totalAmount from transactions 
      WHERE YEAR(created_at) = ? group by
      `;
      sqlgetTransactionSumPerMonth += addedMethodQuery;

      const data = [parseInt(year)];
      console.log(data);
      const [result] = await connection.query(
        sqlgetTransactionSumPerMonth,
        data
      );
      connection.release();

      res.status(200).send({ result });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = { getTransactionSumPerMonth };
