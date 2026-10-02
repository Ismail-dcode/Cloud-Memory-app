const express = require("express");
const multer = require("multer");
const { uploadToS3 } = require("../services/s3Service");
const { isAllowedImage, MAX_FILE_SIZE } = require("../utils/fileValidation");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE }
});

router.post("/upload", upload.single("image"), async (req, res) => {

    try {

        const file = req.file;

        if (!file) {
            return res.status(400).send("No image uploaded");
        }

        if (!isAllowedImage(file)) {
            return res.status(400).send("Only JPEG, PNG, and WebP images are allowed");
        }

        const fileName = `${Date.now()}-${file.originalname}`;

        await uploadToS3({
            key: `images/${fileName}`,
            body: file.buffer,
            contentType: file.mimetype
        });

        res.send(`
            <h1>Upload successful!</h1>
            <p>File: ${fileName}</p>
            <p>Check your S3 bucket.</p>
        `);

    } catch (error) {

        console.error(error);

        if (error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).send("File too large. Max 5 MB.");
        }

        res.status(500).send("Upload failed");
    }

});

module.exports = router;
