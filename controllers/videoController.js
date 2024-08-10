const path = require('path');
const fs = require('fs');
const connection = require('../config/database');
// In controllers/videoController.js
const videoCompression = require('../videoCompression'); // Adjust this path if necessary


// Upload video function
const uploadVideo = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    let { filename, path: filePath, mimetype, size } = req.file;
    filePath = `uploads/${filename}`;

    // SQL query to insert video metadata
    const query = 'INSERT INTO videos (filename, path, mimetype, size, uploadAt) VALUES (?, ?, ?, ?, NOW())';
    const values = [filename, filePath, mimetype, size];

    connection.query(query, values, async (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'Error uploading file',
                error: err.message
            });
        }

        // Define input and output paths for compression
        const inputPath = path.join(__dirname, '../uploads', filename);
        const outputPath = path.join(__dirname, '../uploads/compressed', filename);

        try {
            // Ensure compressed directory exists
            const compressedDir = path.join(__dirname, '../uploads/compressed');
            if (!fs.existsSync(compressedDir)) {
                fs.mkdirSync(compressedDir, { recursive: true });
            }

            // Compress the video
            await compressVideo(inputPath, outputPath);
            fs.unlinkSync(inputPath); // Delete original file after compression

            res.status(201).send({
                message: 'File uploaded and compressed successfully',
                file: req.file
            });
        } catch (error) {
            res.status(500).send('Error compressing video.');
        }
    });
};

// Retrieve video metadata function
const retrieveVideo = (req, res) => {
    const videoId = req.params.id; // Retrieve video by its ID

    // SQL query to fetch video metadata by ID
    const query = 'SELECT * FROM videos WHERE id = ?';
    const values = [videoId];

    connection.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'Error retrieving video',
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).send({
                message: 'Video not found'
            });
        }

        const video = results[0];
        res.status(200).send({
            message: 'Video retrieved successfully',
            video
        });
    });
};

module.exports = { uploadVideo, retrieveVideo };
