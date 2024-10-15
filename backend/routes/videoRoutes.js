const express = require('express');
const fs = require('fs'); // Import fs module
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../config/multerConfig'); // Import the multer configuration
const path = require('path');
const compressVideo = require('../videoCompression');
const assignmentController = require('../controllers/assignmentController');
const db = require('../config/database');

// Route to upload a video file
router.post('/uploads', videoController.setContainerClient, upload.single('file'), videoController.multerErrorHandler, videoController.handleVideoUpload);

// Route to retrieve a video by ID
router.get('/videos/:id', videoController.setContainerClient, videoController.retrieveVideo);


// Example controller route (can be removed if not used)
router.get('/controllers/:id', videoController.retrieveVideo);

// Route to stream a video by IDs
router.get('/stream/:id', videoController.streamVideo);

// Route to get user counts
router.get('/counts', UserController.getUserCounts);


router.post('/test-compress/:id', async (req, res) => {
    const videoId = req.params.id;

    // Fetch the video details from the database
    const query = 'SELECT filename, path FROM video WHERE vid_id = ?';
    db.query(query, [videoId], async (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving video from database', error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const video = result[0];
        const inputPath = path.join(__dirname, '../uploads', video.filename);// This is the original path of the video
        const outputFilename = `compressed_${Date.now()}_${video.filename}`;
        const outputPath = path.resolve(__dirname, '../compressed/', outputFilename); // Save to 'compressed' directory

        try {
            // Run the compression
            const compressedFilePath = await compressVideo(inputPath, outputPath);

            // Update the database with the compressed file path and status
            const updateQuery = 'UPDATE video SET compressed_path = ?, compressed_status = ? WHERE vid_id = ?';
            db.query(updateQuery, [compressedFilePath, 1, videoId], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Error updating video in database', error: err });
                }

                res.json({
                    message: 'Video compressed and updated successfully',
                    compressedPath: compressedFilePath
                });
            });

        } catch (error) {
            console.error('Error compressing video:', error);
            res.status(500).json({ message: 'Error compressing video', error });
        }
    });
});

//Download compressed video by vid_id
const downloadVideo = async (req, res) => {
    const { vid_id } = req.params; // Destructure vid_id from request parameters
    let filePath;

    try {
        // Fetch the compressed file path from the database using vid_id
        const query = 'SELECT compressed_path FROM video WHERE vid_id = ?';
        const result = await new Promise((resolve, reject) => {
            db.query(query, [vid_id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (result.length === 0) {
            return res.status(404).send({ message: 'Video not found' });
        }

        // Get the compressed file path from the database
        filePath = result[0].compressed_path;

        // Check if the file exists using promises and async/await
        await fs.promises.access(filePath, fs.constants.F_OK);

        // Set headers to trigger download
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
        res.setHeader('Content-Type', 'video/mp4'); // Adjust Content-Type based on your video format

        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res).on('error', (err) => {
            console.error(`Error streaming file: ${filePath}`, err);
            res.status(500).send({
                message: 'Error streaming file',
                error: err.message
            });
        });

    } catch (err) {
        console.error(`File not found: ${filePath}`, err);
        res.status(404).send({
            message: 'File not found',
            error: err.message
        });
    }
};

// Define route to download a video by vid_id
router.get('/download/:vid_id', downloadVideo);

//get all assignments
router.get('/assignments', assignmentController.getAllAssignments);
// Route to get video counts by hour 
router.get('/counts/hour', fetchVideoCountsByHour);

module.exports = router;
