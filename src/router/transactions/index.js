const router = require("express").Router();

const { getUserTransactionByStatus } = require("./get");

const {
  getTransactionTotalRevenue,
  getProductTotalRevenue,
  getAllTransactionByStatus,
} = require("./admin/get");

const {
  postWaitingPaymentTransaction,
  postDetailTransaction,
} = require("./post");

const {
  putApproveWaitingPayment,
  putRejectWaitingPayment,
  putFinishPackagingPayment,
} = require("./admin/put");

const { putFinishDeliveringPayment } = require("./put");

router.use(getTransactionTotalRevenue);
router.use(getProductTotalRevenue);
router.use(getUserTransactionByStatus);

router.use(getAllTransactionByStatus);

router.use(postWaitingPaymentTransaction);
router.use(postDetailTransaction);

router.use(putApproveWaitingPayment);
router.use(putRejectWaitingPayment);
router.use(putFinishPackagingPayment);

router.use(putFinishDeliveringPayment);

module.exports = router;
