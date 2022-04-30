const router = require("express").Router();

const {
  getTransactionTotalRevenue,
  getProductTotalRevenue,
  getTransactionHistory,
  getTransactionWaitingPayment,
  getTransactionWaitingConfirmation,
} = require("./get");
const {
  postWaitingPaymentTransaction,
  postDetailTransaction,
} = require("./post");

router.use(getTransactionTotalRevenue);
router.use(getProductTotalRevenue);
router.use(getTransactionWaitingPayment);
router.use(getTransactionWaitingConfirmation);

router.use(postWaitingPaymentTransaction);
router.use(postDetailTransaction);

module.exports = router;
