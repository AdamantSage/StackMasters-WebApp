const multer = require('multer');
const path = require('path');
const fs = require('fs');
// Storage configuration
const uploadDir = path.join(__dirname, '../uploads');
const compressedDir = path.join(__dirname, '../compressed');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Invalid file type'));
};

// Multer instance
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 100*1024*1024  } // Limit file size to 100MB
});

module.exports = upload;