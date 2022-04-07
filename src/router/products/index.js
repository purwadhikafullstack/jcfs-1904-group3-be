const router = require("express").Router();

const {
  getProducts,
  getVariantsProducts,
  getProductsCategory,
} = require("./get");
const { postProductCategory } = require("./post");
const { deleteProductCategoryRouter } = require("./delete");
const { putProductRouter } = require("./put");

router.use(getProducts);
router.use(getVariantsProducts);
router.use(getProductsCategory);

router.use(postProductCategory);

router.use(deleteProductCategoryRouter);

router.use(putProductRouter);

module.exports = router;
