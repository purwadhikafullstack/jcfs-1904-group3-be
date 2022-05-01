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

const getTransactionsByStatus = async (userId, status) => {
  try {
    const connection = await pool.promise().getConnection();

    var sqlGetTransactionByStatus = `select t.id as transactionId, userId,totalAmount,paymentEvidence,status,
  addressId,province,city,district,urban_village,postal_code,detail_address,t.created_at,
  t.updated_at from transactions as t JOIN address as a on a.id = t.addressId where userId = ? and status =
  `;
    const dataGetTransactionByStatus = userId;

    sqlGetTransactionByStatus += ` "${status}";`;

    const [resultTransactions] = await connection.query(
      sqlGetTransactionByStatus,
      dataGetTransactionByStatus
    );
    // This will return a list of transactionId that can be used to get detailTransaction data
    // [31,32]

    const arrayListOfTransactionId = [];

    resultTransactions.filter((value) => {
      arrayListOfTransactionId.push(value.transactionId);
    });

    connection.release();

    return { arrayListOfTransactionId, resultTransactions };
  } catch (error) {
    console.log(error);
  }
};

const getTransactionDetail = async (arrayListOfTransactionId) => {
  try {
    const connection = await pool.promise().getConnection();

    const sqlGetDetailTransactions = `select id as detailTransactionId,transactionId, productName,productPrice,productColor,productSize,quantity,productImage from detailtransactions where transactionId IN(?);
    `;
    const dataGetDetailTransactions = [arrayListOfTransactionId];
    const [resultDetailTransactions] = await connection.query(
      sqlGetDetailTransactions,
      dataGetDetailTransactions
    );

    connection.release();

    return resultDetailTransactions;
  } catch (error) {
    console.log(error);
  }
};

const getTransactionWaitingPayment = router.get(
  "/status/waiting-payment",
  async (req, res) => {
    try {
      const { userId } = req.query;

      const { arrayListOfTransactionId, resultTransactions } =
        await getTransactionsByStatus(userId, "waiting payment");

      const resultDetailTransactions = await getTransactionDetail(
        arrayListOfTransactionId
      );

      res.status(200).send({
        resultTransactions,
        resultDetailTransactions,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const getTransactionWaitingConfirmation = router.get(
  "/status/waiting-confirmation",
  async (req, res) => {
    try {
      const { userId } = req.query;

      const { arrayListOfTransactionId, resultTransactions } =
        await getTransactionsByStatus(userId, "waiting confirmation");

      const resultDetailTransactions = await getTransactionDetail(
        arrayListOfTransactionId
      );

      res.status(200).send({
        resultTransactions,
        resultDetailTransactions,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const getTransactionPackaging = router.get(
  "/status/packaging",
  async (req, res) => {
    try {
      const { userId } = req.query;

      const { arrayListOfTransactionId, resultTransactions } =
        await getTransactionsByStatus(userId, "packaging");

      const resultDetailTransactions = await getTransactionDetail(
        arrayListOfTransactionId
      );

      res.status(200).send({
        resultTransactions,
        resultDetailTransactions,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const getTransactionDelivering = router.get(
  "/status/delivering",
  async (req, res) => {
    try {
      const { userId } = req.query;

      const { arrayListOfTransactionId, resultTransactions } =
        await getTransactionsByStatus(userId, "delivering");

      const resultDetailTransactions = await getTransactionDetail(
        arrayListOfTransactionId
      );

      res.status(200).send({
        resultTransactions,
        resultDetailTransactions,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

const getTramsactionCompleted = router.get(
  "/status/completed",
  async (req, res) => {
    try {
      const { userId } = req.query;

      const { arrayListOfTransactionId, resultTransactions } =
        await getTransactionsByStatus(userId, "completed");

      const resultDetailTransactions = await getTransactionDetail(
        arrayListOfTransactionId
      );

      res.status(200).send({
        resultTransactions,
        resultDetailTransactions,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
const getTransactionCanceled = router.get(
  "/status/canceled",
  async (req, res) => {
    try {
      const { userId } = req.query;

      const { arrayListOfTransactionId, resultTransactions } =
        await getTransactionsByStatus(userId, "canceled");

      const resultDetailTransactions = await getTransactionDetail(
        arrayListOfTransactionId
      );

      res.status(200).send({
        resultTransactions,
        resultDetailTransactions,
      });
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = {
  getTransactionTotalRevenue,
  getProductTotalRevenue,
  getTransactionWaitingPayment,
  getTransactionWaitingConfirmation,
  getTransactionPackaging,
  getTransactionDelivering,
  getTramsactionCompleted,
  getTransactionCanceled,
};
