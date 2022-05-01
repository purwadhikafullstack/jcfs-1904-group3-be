const router = require("express").Router();

const {
  getTransactionTotalRevenue,
  getProductTotalRevenue,
  getTransactionPackaging,
  getTransactionWaitingPayment,
  getTransactionWaitingConfirmation,
  getTransactionDelivering,
  getTramsactionCompleted,
  getTransactionCanceled,
} = require("./get");
const {
  postWaitingPaymentTransaction,
  postDetailTransaction,
} = require("./post");

router.use(getTransactionPackaging);
router.use(getTransactionTotalRevenue);
router.use(getProductTotalRevenue);
router.use(getTransactionWaitingPayment);
router.use(getTransactionWaitingConfirmation);
router.use(getTransactionDelivering);
router.use(getTramsactionCompleted);
router.use(getTransactionCanceled);

router.use(postWaitingPaymentTransaction);
router.use(postDetailTransaction);

module.exports = router;
