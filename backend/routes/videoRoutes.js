const express = require('express');
const fs = require('fs'); // Import fs module
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../config/multerConfig'); // Import the multer configuration
const path = require('path');
const compressVideo = require('../videoCompression');
const assignmentController = require('../controllers/assignmentController');

// Route to upload a video file
router.post('/uploads', videoController.setContainerClient, upload.single('file'), videoController.multerErrorHandler, videoController.handleVideoUpload);

// Route to retrieve a video by ID
router.get('/videos/:id', videoController.setContainerClient, videoController.retrieveVideo);

// Route to download a video by filename
router.get('/download/:filename', videoController.downloadVideo);

// Example controller route (can be removed if not used)
router.get('/controllers/:id', videoController.retrieveVideo);

// Route to stream a video by ID
router.get('/stream/:id', videoController.streamVideo);

// Additional route for video compression testing
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

// Catch-all route for undefined routes
router.use((req, res) => {
    res.status(404).send('Route not found');
});



//get all assignments
router.get('/assignments', assignmentController.getAllAssignments);

module.exports = router;
