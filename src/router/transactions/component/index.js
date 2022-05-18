const router = require("express").Router();
const pool = require("../../../config/database");

const getTransactionsByStatus = async (userId, status, limit, offset) => {
  const connection = await pool.promise().getConnection();
  try {
    if (userId) {
      var sqlGetTransactionByStatus = `select t.id as transactionId, userId,totalAmount,paymentEvidence,status,
        addressId,province,city,district,urban_village,postal_code,detail_address,t.created_at,
        t.updated_at from transactions as t JOIN address as a on a.id = t.addressId where userId = ? and status =
        `;

      sqlGetTransactionByStatus += ` "${status}";`;

      const [resultTransactions] = await connection.query(
        sqlGetTransactionByStatus,
        userId
      );
      // This will return a list of transactionId that can be used to get detailTransaction data
      // [31,32]

      const arrayListOfTransactionId = [];

      resultTransactions.filter((value) => {
        arrayListOfTransactionId.push(value.transactionId);
      });

      connection.release();

      return { arrayListOfTransactionId, resultTransactions };
    }
    if (limit) {
      var sqlGetTransactionByStatus = `select t.id as transactionId, userId,totalAmount,paymentEvidence,status,
        addressId,province,city,district,urban_village,postal_code,detail_address,t.created_at,
        t.updated_at from transactions as t JOIN address as a on a.id = t.addressId where status =
        `;
      sqlGetTransactionByStatus += ` "${status}" LIMIT ${limit} OFFSET ${offset};`;

      const [resultTransactions] = await connection.query(
        sqlGetTransactionByStatus
      );

      var sqlCountMaxPage = `select count(id) as totalData from transactions where status =`;
      sqlCountMaxPage += ` "${status}";`;
      const [dataCount] = await connection.query(sqlCountMaxPage);
      // This will return a list of transactionId that can be used to get detailTransaction data
      // [31,32]

      const arrayListOfTransactionId = [];

      resultTransactions.filter((value) => {
        arrayListOfTransactionId.push(value.transactionId);
      });

      const arrayListOfUserId = [];

      resultTransactions.filter((value) => {
        arrayListOfUserId.push(value.userId);
      });

      connection.release();

      return {
        arrayListOfTransactionId,
        arrayListOfUserId,
        resultTransactions,
        dataCount,
      };
    }
  } catch (error) {
    connection.release();
    console.log(error);
  }
};

const getTransactionDetail = async (arrayListOfTransactionId) => {
  const connection = await pool.promise().getConnection();
  try {
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
    connection.release();
    console.log(error);
  }
};

const getUserDetail = async (arrayListOfUserId) => {
  const connection = await pool.promise().getConnection();
  try {
    const sqlGetUserDetail = `select id as userId,username,email from users where id IN(?);`;
    const dataGetUserDetail = [arrayListOfUserId];
    const [resultUserDetail] = await connection.query(
      sqlGetUserDetail,
      dataGetUserDetail
    );

    connection.release();

    return resultUserDetail;
  } catch (error) {
    connection.release();
    console.log(error);
  }
};

module.exports = {
  getTransactionsByStatus,
  getTransactionDetail,
  getUserDetail,
};
