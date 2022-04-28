const router = require("express").Router();

const { postAddress } = require("./post");

router.use(postAddress);

module.exports = router;
