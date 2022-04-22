const router = require("express").Router();

const { getTransactionTotalRevenue, getProductTotalRevenue } = require("./get");
const {
  postWaitingPaymentTransaction,
  postDetailTransaction,
} = require("./post");

router.use(getTransactionTotalRevenue);
router.use(getProductTotalRevenue);

router.use(postWaitingPaymentTransaction);
router.use(postDetailTransaction);

module.exports = router;
