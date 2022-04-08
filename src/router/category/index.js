const router = require("express").Router();

const { getCategory } = require("./get");

router.use(getCategory);

module.exports = router;
