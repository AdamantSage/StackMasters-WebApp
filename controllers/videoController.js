
const path = require('path');
const fs = require('fs');
//might not need what is above

const connection = require('../config/database');

// Upload video function
//Post request to hanndle file upload and metadata insertion
const uploadVideo = (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { filename, path, mimetype, size } = req.file;

    //variable for file path, this can be a AWS RDS url of the uploaded file
    const filePath = `videos/${file.filename}`;

    // SQL query to insert video metadata
    const query = 'INSERT INTO videos (filename, path, mimetype, size, uploadedAt) VALUES (?, ?, ?, ?, NOW())';
    const values = [filename, path, mimetype, size, uploadDate];

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

module.exports = { uploadVideo };
 