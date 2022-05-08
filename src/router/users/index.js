const router = require("express").Router();

const { postRegisterUser, postLoginRouter } = require("./post");

router.use(postRegisterUser);
router.use(postLoginRouter);

module.exports = router;
