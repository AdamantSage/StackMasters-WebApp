
const fs = require('fs');
const path = require('path');
const { emitNotification } = require('../NotificationWebSocket.js');
//code for videoSrtreaming
const multer = require('multer');
const http = require('http');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv/config');



//setup environment variables
const accountName =process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName =process.env.CONTAINER_NAME;

//estabilishing connection with azure blob storage
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient(containerName);


// Function to stream video
const streamVideo = (req, res) => {
    const videoId = req.params.id;

    // SQL query to fetch video metadata by vid_id
    const query = 'SELECT filename, path FROM videos WHERE vid_id = ?';
    const values = [videoId];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error(`Error retrieving video from database: ${err.message}`);
            return res.status(500).send({
                message: 'Error retrieving video',
                error: err.message
            });
        }

        if (results.length === 0) {
            console.error(`Video not found for ID: ${videoId}`);
            return res.status(404).send({
                message: 'Video not found'
            });
        }

        const video = results[0];
        const videoPath = path.join(__dirname, '../uploads', video.filename); // Adjust to your storage directory
        console.log(`Streaming video from path: ${videoPath}`);

        try {
            const videoSize = fs.statSync(videoPath).size;
            const range = req.headers.range;

            if (!range) {
                // No Range header, send entire video
                const headers = {
                    "Content-Length": videoSize,
                    "Content-Type": 'video/mp4' // Update to video.mimetype if dynamic types are needed
                };

                res.writeHead(200, headers);

                const videoStream = fs.createReadStream(videoPath);

                videoStream.on('open', () => {
                    videoStream.pipe(res);
                });

                videoStream.on('error', (streamErr) => {
                    console.error(`Error streaming video: ${streamErr.message}`);
                    res.status(500).send({
                        message: 'Error streaming video',
                        error: streamErr.message
                    });
                });

            } else {
                // Handle Range request
                const parts = range.replace(/bytes=/, "").split("-");
                const start = parseInt(parts[0], 10);
                const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

                if (start >= videoSize || start < 0 || end >= videoSize) {
                    return res.status(416).send('Requested range not satisfiable');
                }

                const contentLength = end - start + 1;
                const headers = {
                    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": contentLength,
                    "Content-Type": 'video/mp4' // Update to video.mimetype if dynamic types are needed
                };

                res.writeHead(206, headers);

                const videoStream = fs.createReadStream(videoPath, { start, end });

                videoStream.on('open', () => {
                    videoStream.pipe(res);
                });

                videoStream.on('error', (streamErr) => {
                    console.error(`Error streaming video: ${streamErr.message}`);
                    res.status(500).send({
                        message: 'Error streaming video',
                        error: streamErr.message
                    });
                });
            }

        } catch (fileErr) {
            console.error(`Error accessing video file: ${fileErr.message}`);
            return res.status(500).send({
                message: 'Error accessing video file',
                error: fileErr.message
            });
        }
    });
};


const connection = require('../config/database');

// Upload video function
//Post request to hanndle file upload and metadata insertion
// Upload video function
// Post request to handle file upload and metadata insertion
// Upload video function
const handleVideoUpload = (req, res) => {
    console.log('Request body:', req.body); // Log the entire request body

    // Check if file was uploaded
    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    const { filename, mimetype, size } = req.file;

    // Check and log the variable you're trying to split
    const someVariableToSplit = req.body.someProperty; // Ensure this is sent from Postman
    console.log('someVariableToSplit:', someVariableToSplit); // Log its value

    // Validate the variable before splitting
    if (typeof someVariableToSplit === 'string' && someVariableToSplit.includes('-')) {
        try {
            const parts = someVariableToSplit.split('-');
            console.log('Split parts:', parts);
        } catch (error) {
            console.error('Error splitting someVariableToSplit:', error);
            return res.status(500).send({
                message: 'Error processing the variable',
                error: error.message
            });
        }
    } else {
        console.error('someVariableToSplit is either undefined or does not contain a valid string to split');
    }

    const path = `videos/${filename}`;
    const blobClient = containerClient.getBlockBlobClient(filename);
    
    // Upload to Azure Blob Storage
    blobClient.uploadData(req.file.buffer)
        .then(() => {
            const query = 'INSERT INTO videos (filename, path, mimetype, size, uploadAt) VALUES (?, ?, ?, ?, NOW())';
            const values = [filename, path, mimetype, size];

            // Insert metadata into the database
            connection.query(query, values, (err, results) => {
                if (err) {
                    console.error('Error inserting video metadata:', err);
                    return res.status(500).send({
                        message: 'Error uploading video',
                        error: err.message
                    });
                }

                emitNotification('videoUploadSuccess', { filename, path, mimetype, size });

                res.status(201).send({
                    message: 'Video uploaded successfully',
                    file: req.file
                });
            });
        })
        .catch((error) => {
            console.error('Error uploading video to Azure Blob Storage:', error);
            res.status(500).send('Error uploading video to storage.');
        });
};




// Catch possible multer errors (like file size limits)
/*Multer Error Handling: The multerErrorHandler middleware captures specific errors related 
to file uploads, such as exceeding file size limits or invalid file types. It logs these errors
 and sends a clear response back 
to the client.*/

const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error(`Multer error: ${err.message}`);
        return res.status(400).send({
            message: 'Multer error occurred during file upload',
            error: err.message
        });
    } else if (err) {
        console.error(`Unknown error: ${err.message}`);
        return res.status(500).send({
            message: 'An unknown error occurred during file upload',
            error: err.message
        });
    }
    next();
};


// Upload video function
const retrieveVideo = (req, res) => {
    const videoId = req.params.id; // Assuming you retrieve the video by its ID

    // SQL query to fetch video metadata by ID
    const query = 'SELECT * FROM videos WHERE vid_id = ?';
    const values = [videoId];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error(`Error retrieving video with ID ${videoId}:`, err.message);
            return res.status(500).send({
                message: 'Error retrieving video',
                error: err.message
            });
        }

        if (results.length === 0) {
            console.log(`Video with ID ${videoId} not found.`);
            return res.status(404).send({
                message: 'Video not found'
            });
        }

        const video = results[0];
        console.log(`Video with ID ${videoId} retrieved successfully.`);

        emitNotification('videoRetrieveSuccess', { videoId, video });
    
        res.status(200).send({
            message: 'Video retrieved successfully',
            video
        });
    });
};

const uploadVideo = async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    let { filename } = req.file;
    const filePath = `uploads/${filename}`; // Ensure this is a valid path

    console.log('File uploaded:', filename);

    // Insert video metadata with "pending" status for compression
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
            // Compress the video
            await compressVideo(inputPath, outputPath);
            fs.unlinkSync(inputPath); // Delete original file after compression

            // Upload the compressed video to Azure Blob Storage
            const blobClient = containerClient.getBlockBlobClient(filename);
            await blobClient.uploadFile(outputPath); // Upload compressed file to Azure

            const azureBlobUrl = blobClient.url; // Get URL of the uploaded compressed video

            // Delete the local compressed file after uploading to Azure
            fs.unlinkSync(outputPath);

            // Update video metadata in the database with Azure URL
            const updateQuery = 'UPDATE videos SET compressed_path = ?, compression_status = ? WHERE id = ?';
            const updateValues = [azureBlobUrl, 'completed', results.insertId];

            connection.query(updateQuery, updateValues, (updateErr) => {
                if (updateErr) {
                    console.error('Error updating video metadata:', updateErr);
                    return res.status(500).send({ message: 'Error updating video metadata.', error: updateErr.message });
                }

                console.log('Video processed, uploaded to Azure, and metadata updated.');
                res.status(201).send({ message: 'File uploaded, compressed, and stored successfully', file: req.file });
            });
        } catch (error) {
            console.error('Error compressing or uploading video:', error);
            res.status(500).send({ message: 'Error processing video.', error: error.message });
        }
    });
};



module.exports = {retrieveVideo, streamVideo,multerErrorHandler, handleVideoUpload ,uploadVideo, containerClient };

 