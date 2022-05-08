const router = require("express").Router();
const pool = require("../../config/database");
const {
  getTransactionsByStatus,
  getTransactionDetail,
} = require("./component");
const auth = require("../../middleware/auth");

const getUserTransactionByStatus = router.get(
  "/user/status",
  auth,
  async (req, res) => {
    try {
      const { userId, status } = req.query;

      const { arrayListOfTransactionId, resultTransactions } =
        await getTransactionsByStatus(userId, status);

      if (resultTransactions.length != 0) {
        const resultDetailTransactions = await getTransactionDetail(
          arrayListOfTransactionId
        );

        res.status(200).send({
          resultTransactions,
          resultDetailTransactions,
        });
      } else {
        res.status(200).send({
          message: "data is emptry",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = {
  getUserTransactionByStatus,
};
