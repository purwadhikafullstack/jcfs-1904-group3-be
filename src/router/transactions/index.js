const router = require("express").Router();

const {
  getTransactionPackaging,
  getTransactionWaitingPayment,
  getTransactionWaitingConfirmation,
  getTransactionDelivering,
  getTramsactionCompleted,
  getTransactionComplained,
} = require("./get");

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

router.use(getTransactionPackaging);
router.use(getTransactionTotalRevenue);
router.use(getProductTotalRevenue);
router.use(getTransactionWaitingPayment);
router.use(getTransactionWaitingConfirmation);
router.use(getTransactionDelivering);
router.use(getTramsactionCompleted);
router.use(getTransactionComplained);

router.use(getAllTransactionByStatus);

router.use(postWaitingPaymentTransaction);
router.use(postDetailTransaction);

router.use(putApproveWaitingPayment);
router.use(putRejectWaitingPayment);
router.use(putFinishPackagingPayment);

module.exports = router;
