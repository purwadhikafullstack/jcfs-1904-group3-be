const router = require("express").Router();

const { postCart } = require("./post");
const { putCartQuantity } = require("./put");
const { getCarts } = require("./get");
const { deleteCarts } = require("./delete");

router.use(postCart);
router.use(putCartQuantity);
router.use(getCarts);
router.use(deleteCarts);

module.exports = router;
