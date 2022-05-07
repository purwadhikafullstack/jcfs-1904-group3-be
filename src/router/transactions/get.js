const router = require("express").Router();
const pool = require("../../config/database");
const {
  getTransactionsByStatus,
  getTransactionDetail,
} = require("./component");

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
const getTransactionComplained = router.get(
  "/status/complained",
  async (req, res) => {
    try {
      const { userId } = req.query;

      const { arrayListOfTransactionId, resultTransactions } =
        await getTransactionsByStatus(userId, "complained");

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
  getTransactionWaitingPayment,
  getTransactionWaitingConfirmation,
  getTransactionPackaging,
  getTransactionDelivering,
  getTramsactionCompleted,
  getTransactionComplained,
};
