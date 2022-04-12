const router = require("express").Router();

const { getTransactionSumPerMonth } = require("./get");

router.use(getTransactionSumPerMonth);

module.exports = router;
