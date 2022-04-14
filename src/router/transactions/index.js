const router = require("express").Router();

const { getTransactionTotalRevenue, getProductTotalRevenue } = require("./get");

router.use(getTransactionTotalRevenue);
router.use(getProductTotalRevenue);

module.exports = router;
