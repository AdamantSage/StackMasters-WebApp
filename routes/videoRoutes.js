const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../config/multerConfig'); // Import Multer configuration

// Define the routes and their handlers
router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('/videos/:id', videoController.retrieveVideo);

// Add this route to your videoRoutes.js
router.post('/test-compress', async (req, res) => {
    const inputPath = './uploads/sample.mp4';// Adjust these paths
    const outputPath = './compressed/sample_compressed.mp4';

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
