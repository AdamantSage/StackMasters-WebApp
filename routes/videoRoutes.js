// videoRoutes.js
const express = require('express');
const router = express.Router();
const path = require('path');
const videoController = require('../controllers/videoController');
const upload = require('../config/multerConfig'); // Import Multer configuration
const compressVideo = require('../videoCompression'); // Ensure this path is correct

// Define the routes and their handlers
router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('/videos/:id', videoController.retrieveVideo);

// Test compression route
router.post('/test-compress', async (req, res) => {
    const inputPath = path.resolve(__dirname, '../uploads/compressed/example.mp4'); 
    const outputPath = path.resolve(__dirname, '../compressed/example_compressed.mp4');

    try {
        await compressVideo(inputPath, outputPath);
        res.status(200).send('Compression succeeded');
    } catch (error) {
        res.status(500).send({
            message: 'Compression failed',
            error: error.message
        });
    }
});

module.exports = router;
