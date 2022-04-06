const router = require("express").Router();

const {
  getProducts,
  getVariantsProducts,
  getProductsCategory,
} = require("./get");
const { postProductCategory } = require("./post");

router.use(getProducts);
router.use(getVariantsProducts);
router.use(getProductsCategory);
router.use(postProductCategory);

module.exports = router;
