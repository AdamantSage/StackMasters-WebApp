const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs'); // Import fs module
const videoController = require('../../controllers/videoController');
const upload = require('../../config/multerConfig'); // Import Multer configuration
const compressVideo = require('../videoCompression'); 

// Define the routes and their handlers
router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('/videos/:id', videoController.retrieveVideo);

// Route to download a video file by its filename
router.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../compressed', filename); // Adjust path as needed

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filePath}`, err);
            return res.status(404).send('File not found.');
        }

        // Set headers to trigger download
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'video/mp4'); // Adjust Content-Type based on your video format

        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res).on('error', (err) => {
            console.error(`Error streaming file: ${filename}`, err);
            res.status(500).send('Error streaming file.');
        });
    });
});

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
