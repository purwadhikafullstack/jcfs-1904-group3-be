const router = require("express").Router();

const {
  getFilteredProduct,
  getVariantsProducts,
  getProductsCategory,
  getProducts,
  getCartsProductVariant,
} = require("./get");
const {
  postProductCategory,
  postVariantImage,
  postProductVariant,
  postProduct,
} = require("./post");
const { deleteProductCategoryRouter, deleteProduct } = require("./delete");
const { putProductRouter } = require("./put");

router.use(getFilteredProduct);
router.use(getVariantsProducts);
router.use(getProductsCategory);
router.use(getCartsProductVariant);

router.use(postProductCategory);
router.use(postVariantImage);
router.use(postProductVariant);
router.use(postProduct);

router.use(deleteProductCategoryRouter);
router.use(deleteProduct);

router.use(putProductRouter);

module.exports = router;
