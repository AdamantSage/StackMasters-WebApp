const express = require('express');
const fs = require('fs'); // Import fs module
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../config/multerConfig'); // Import the multer configuration
const compressVideo = require('../videoCompression');
const axios = require('axios');  //npm install axios


router.post('/controllers', upload.single('file'), videoController.handleVideoUpload, videoController.multerErrorHandler);
router.get('/controllers/:id', videoController.retrieveVideo);

router.get('/stream/:id', videoController.streamVideo);

//Run Test compression
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



router.get('/download/:id', async (req, res) => {
    const videoId = req.params.id;

    const query = 'SELECT compressed_path FROM videos WHERE id = ?';
    
    connection.query(query, [videoId], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error retrieving video information.');
        }

        if (results.length === 0) {
            return res.status(404).send('Video not found.');
        }

        const videoUrl = results[0].compressed_path;

        try {
            const response = await axios({
                method: 'get',
                url: videoUrl,
                responseType: 'stream' // Stream the response
            });

            res.setHeader('Content-Disposition', `attachment; filename="${videoUrl.split('/').pop()}"`);
            res.setHeader('Content-Type', response.headers['content-type']); // Use the content type from the response
            response.data.pipe(res); // Pipe the data to the response

            response.data.on('error', (err) => {
                console.error('Error streaming video:', err);
                res.status(500).send('Error streaming video.');
            });
        } catch (error) {
            console.error('Error fetching video from URL:', error);
            res.status(500).send('Error downloading video.');
        }
    });
});


module.exports = router;