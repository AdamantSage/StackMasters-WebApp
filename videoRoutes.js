// Import required modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const compressVideo = require('../videoCompression'); // Import the video compression function

const router = express.Router();

// Configure Multer storage for video uploads
const videoStorage = multer.diskStorage({
    destination: 'videos', // Destination folder for storing videos
    filename: (req, file, cb) => {
        const uniqueName = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName); // Set unique filename for each video
    }
});

const upload = multer({ storage: videoStorage });

// Route to upload and compress video files
router.post('/upload', upload.single('video'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Define input and output paths for the video
    const inputPath = path.join(__dirname, '../videos', req.file.filename);
    const outputPath = path.join(__dirname, '../videos/compressed', req.file.filename);

    try {
        // Compress the video and save it to the output path
        await compressVideo(inputPath, outputPath);
        res.status(200).send('Video uploaded and compressed successfully.');
    } catch (error) {
        res.status(500).send('Error compressing video.');
    }
});

module.exports = router;
