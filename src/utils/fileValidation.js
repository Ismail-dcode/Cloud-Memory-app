const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function isAllowedImage(file) {
    return file && ALLOWED_TYPES.includes(file.mimetype);
}

module.exports = { ALLOWED_TYPES, MAX_FILE_SIZE, isAllowedImage };
