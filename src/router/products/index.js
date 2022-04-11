const router = require("express").Router();

const {
  getProducts,
  getVariantsProducts,
  getProductsCategory,
} = require("./get");
const {
  postProductCategory,
  postVariantImage,
  postProductVariant,
  postProduct,
} = require("./post");
const { deleteProductCategoryRouter } = require("./delete");
const { putProductRouter } = require("./put");

router.use(getProducts);
router.use(getVariantsProducts);
router.use(getProductsCategory);

router.use(postProductCategory);
router.use(postVariantImage);
router.use(postProductVariant);
router.use(postProduct);

router.use(deleteProductCategoryRouter);

router.use(putProductRouter);

module.exports = router;
