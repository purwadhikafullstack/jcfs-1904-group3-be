const router = require("express").Router();
const pool = require("../../config/database");

const getTransactionTotalRevenue = router.get(
  "/total-revenue",
  async (req, res) => {
    try {
      const connection = await pool.promise().getConnection();
      const { year, method } = req.query;
      const addedMethodQuery = ` ${method}(created_at);`;
      var sqlgetTransactionTotalRevenue = `select created_at as Date , sum(totalAmount) as totalAmount from transactions 
      WHERE YEAR(created_at) = ? group by
      `;
      sqlgetTransactionTotalRevenue += addedMethodQuery;

      const data = [parseInt(year)];
      const [result] = await connection.query(
        sqlgetTransactionTotalRevenue,
        data
      );
      connection.release();

      res.status(200).send({ result });
    } catch (error) {
      console.log(error);
    }
  }
);

const getProductTotalRevenue = router.get(
  "/product/total-revenue",
  async (req, res) => {
    try {
      const connection = await pool.promise().getConnection();
      const { productName, sortMethod, sortMethodValue } = req.query;
      const method = sortMethod;
      const value = parseInt(sortMethodValue);

      var sqlGetProductTotalRevenue = `select t.created_at as Date, sum(totalAmount) as totalAmount from transactions as t 
      join detailtransactions as dt ON t.id = dt.transactionId 
      where productName Like ?`;

      const data = productName;

      if (sortMethodValue) {
        sqlGetProductTotalRevenue += ` and YEAR(t.created_at)=${value} group by ${method}(t.created_at);`;
      } else {
        sqlGetProductTotalRevenue += ` group by ${method}(t.created_at);`;
      }

      const [result] = await connection.query(sqlGetProductTotalRevenue, data);
      connection.release();

      res.status(200).send({ result });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = { getTransactionTotalRevenue, getProductTotalRevenue };
