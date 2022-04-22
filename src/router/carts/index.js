const router = require("express").Router();

const { postCart } = require("./post");
const { putCartQuantity } = require("./put");
const { getCarts } = require("./get");
const { deleteCarts, deleteCartWhenCheckout } = require("./delete");

router.use(postCart);

router.use(putCartQuantity);

router.use(getCarts);

router.use(deleteCarts);
router.use(deleteCartWhenCheckout);

module.exports = router;
