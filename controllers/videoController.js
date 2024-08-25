const path = require('path');
const fs = require('fs');
const connection = require('../config/database');
const compressVideo = require('../videoCompression'); // Adjust this path if necessary

const uploadVideo = async (req, res) => {
    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    let { filename } = req.file;
    const filePath = `uploads/${filename}`;

    console.log('File uploaded:', filename);

    // Insert video metadata
    const query = 'INSERT INTO videos (original_path, compressed_path, compression_status) VALUES (?, ?, ?)';
    const values = [filePath, null, 'pending'];

    connection.query(query, values, async (err, results) => {
        if (err) {
            console.error('Error saving video metadata:', err);
            return res.status(500).send({ message: 'Error saving video metadata.', error: err.message });
        }

        const inputPath = path.join(__dirname, '../uploads', filename);
        const outputPath = path.join(__dirname, '../uploads/compressed', filename);

        console.log(`Compressing video from ${inputPath} to ${outputPath}`);
        try {
            await compressVideo(inputPath, outputPath);
            fs.unlinkSync(inputPath); // Delete original file after compression

            // Update video metadata
            const updateQuery = 'UPDATE videos SET compressed_path = ?, compression_status = ? WHERE id = ?';
            const updateValues = [outputPath, 'completed', results.insertId];

            connection.query(updateQuery, updateValues, (updateErr) => {
                if (updateErr) {
                    console.error('Error updating video metadata:', updateErr);
                    return res.status(500).send({ message: 'Error updating video metadata.', error: updateErr.message });
                }

                console.log('Video processed and metadata updated.');
                res.status(201).send({ message: 'File uploaded and compressed successfully', file: req.file });
            });
        } catch (error) {
            console.error('Error compressing video:', error);
            res.status(500).send({ message: 'Error compressing video.', error: error.message });
        }
    });
};


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
