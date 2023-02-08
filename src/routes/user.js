const express = require("express");
const router = express.Router();
const { userController } = require("../controllers/user");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/register", userController.register);
router.post("/register/verification", userController.verificationOtp);
router.post("/login", userController.login);
router.get("/profile", protect, userController.profile);
router.put("/profile", protect, upload.single("photo"), userController.update);

module.exports = router;
