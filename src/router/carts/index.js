const router = require("express").Router();

const { postCart } = require("./post");

router.use(postCart);

module.exports = router;
