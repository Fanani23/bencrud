const express = require("express");
const router = express.Router();
const userRouter = require("../routes/user");
const goodRouter = require("../routes/good");

router.use("/users", userRouter);
router.use("/goods", goodRouter);

module.exports = router;
