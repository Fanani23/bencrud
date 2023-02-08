const express = require("express");
const router = express.Router();
const { goodController } = require("../controllers/good");
const { protect } = require("../middlewares/auth");
const upload = require("../middlewares/upload");

router.post("/", protect, upload.single("photo"), goodController.create);
router.get("/", goodController.get);
router.get("/good/:id", protect, goodController.getById);
router.put("/:id", protect, upload.single("photo"), goodController.update);
router.delete("/:id", protect, goodController.delete);

module.exports = router;
