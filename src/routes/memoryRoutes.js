const express = require("express");
const multer = require("multer");
const memoryController = require("../controllers/memoryController");
const authMiddleware = require("../middleware/authMiddleware");
const { MAX_FILE_SIZE } = require("../utils/fileValidation");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE }
});

router.use(authMiddleware);

router.post("/", upload.array("photos", 5), memoryController.create);
router.get("/", memoryController.list);
router.get("/:id", memoryController.getOne);
router.put("/:id", upload.array("photos", 5), memoryController.update);
router.delete("/:id", memoryController.remove);

module.exports = router;
