const router = require("express").Router();

const { postCart } = require("./post");
const { putCartQuantity } = require("./put");
const { getCarts } = require("./get");

router.use(postCart);
router.use(putCartQuantity);
router.use(getCarts);

module.exports = router;
