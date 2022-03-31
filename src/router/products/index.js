const router = require("express").Router();

const { getProducts, getVariantsProducts } = require("./get");

router.use(getProducts);
router.use(getVariantsProducts);

module.exports = router;
