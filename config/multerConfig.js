const multer = require('multer');

const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Destination folder
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}${ext}`;
        cb(null, fileName); // Use a unique filename
    }
});

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
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1000000000  } // Limit file size to 100MB
});

module.exports = upload;
