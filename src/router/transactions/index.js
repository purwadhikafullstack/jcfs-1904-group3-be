const router = require("express").Router();

const {
  getTransactionTotalRevenue,
  getProductTotalRevenue,
  getTransactionHistory,
} = require("./get");
const {
  postWaitingPaymentTransaction,
  postDetailTransaction,
} = require("./post");

router.use(getTransactionTotalRevenue);
router.use(getProductTotalRevenue);
router.use(getTransactionHistory);

router.use(postWaitingPaymentTransaction);
router.use(postDetailTransaction);

module.exports = router;
