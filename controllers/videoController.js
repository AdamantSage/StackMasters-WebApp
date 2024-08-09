

//const fs = require('fs');//file stream
//might not need what is above

const connection = require('../config/database');

// Upload video function
//Post request to hanndle file upload and metadata insertion
const uploadVideo = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Use let instead of const to allow reassignment
    let { filename, path, mimetype, size } = req.file;

    //variable for file path, this can be an AWS S3 URL or local path
    path = `videos/${filename}`;

    // SQL query to insert video metadata
    const query = 'INSERT INTO videos (filename, path, mimetype, size, uploadAt) VALUES (?, ?, ?, ?, NOW())';
    const values = [filename, path, mimetype, size];

    connection.query(query, values, (err, results) => {
        if (err) {
            return res.status(500).send({
                message: 'Error uploading file',
                error: err.message
            });
        }

        res.status(201).send({
            message: 'File uploaded successfully',
            file: req.file
        });
    });
};

// Upload video function
const retrieveVideo = (req, res) => {
    const videoId = req.params.id; // Assuming you retrieve the video by its ID

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

 