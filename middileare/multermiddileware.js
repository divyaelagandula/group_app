// src/config/multerConfig.js

const multer = require('multer');

// Configure Multer to store the file buffer in memory
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// We export the configured 'upload' object
module.exports = upload;