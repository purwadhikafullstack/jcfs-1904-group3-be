const router = require("express").Router();

const getProducts = require("./get");

router.use(getProducts);

module.exports = router;
