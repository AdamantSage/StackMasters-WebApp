const fs = require('fs');
const path = require('path');
const { emitNotification } = require('../NotificationWebSocket.js');
const multer = require('multer');
const http = require('http');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config(); 
const connection = require('../config/database'); // Adjust the path as needed
const compressVideo = require('../videoCompression.js');

// Setup environment variables
const accountName = process.env.ACCOUNT_NAME;
const sasToken = process.env.SAS_TOKEN;
const containerName = process.env.CONTAINER_NAME;

// Establishing connection with Azure Blob Storage
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net/?${sasToken}`);
const containerClient = blobServiceClient.getContainerClient('stackblob');

// Middleware to set containerClient
const setContainerClient = (req, res, next) => {
    try {
        console.log('Setting container client...');
        req.containerClient = containerClient; // Attach the container client
        console.log('Container client set successfully');
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error setting container client:', error);
        res.status(500).send({
            message: 'Failed to set container client'
        });
    }
};
// Function to stream video
const streamVideo = async (req, res) => {
    const videoId = req.params.id;

    const query = 'SELECT filename FROM videos WHERE vid_id = ?';
    const values = [videoId];

    connection.query(query, values, async (err, results) => {
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
        const blobClient = req.containerClient.getBlockBlobClient(video.filename);

        const downloadBlockBlobResponse = await blobClient.download(0);
        
        res.set({
            'Content-Type': 'video/mp4',
            'Content-Length': downloadBlockBlobResponse.contentLength
        });
        
        downloadBlockBlobResponse.readableStreamBody.pipe(res);
    });
};

//upload video
const handleVideoUpload = async (req, res) => {
    console.log('Request body:', req.body);

    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const filePath = `videos/${originalname}`;
    const blobClient = req.containerClient.getBlockBlobClient(originalname);
    const videoUrl = blobClient.url; // Get the URL for the uploaded video

    // Extract user_id from the request body
    const userId = req.body.user_id;

    // Ensure user_id is provided
    if (!userId) {
        console.error('No user ID provided.');
        return res.status(400).send('No user ID provided.');
    }

    try {
        // Upload to Azure Blob Storage
        await blobClient.uploadData(buffer);

        // SQL query to insert video metadata into the database
        const query = `
            INSERT INTO videos (filename, path, mimetype, size, uploadAt, user_id, compressed_path, compressed_status, videoUrl) 
            VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)`;
        const values = [originalname, filePath, mimetype, size, userId, null, 0, videoUrl]; // Set compressed_path to null and compressed_status to 0

        connection.query(query, values, (err) => {
            if (err) {
                console.error('Error inserting video metadata:', err);
                return res.status(500).send({
                    message: 'Error uploading video',
                    error: err.message
                });
            }

            emitNotification('videoUploadSuccess', { filename: originalname, path: filePath, mimetype, size, videoUrl });

            res.status(201).send({
                message: 'Video uploaded successfully',
                file: req.file,
                videoUrl // Return the URL in the response
            });
        });
    } catch (error) {
        console.error('Error uploading video to Azure Blob Storage:', error);
        res.status(500).send('Error uploading video to storage.');
    }
};

// Retrieve Video
const retrieveVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await getVideoMetadata(videoId);

        // Check if the containerClient is available
        if (!req.containerClient) {
            console.error('Container client is not set in the request.');
            return res.status(500).send({
                message: 'Internal Server Error: Container client not set.'
            });
        } 

        // Retrieve the video URL directly from the metadata
        const videoUrl = video.videoUrl;

        // Check if the video exists in Azure Blob Storage
        const blobClient = req.containerClient.getBlockBlobClient(video.filename);
        const exists = await blobClient.exists();
        if (!exists) {
            console.log(`Video ${video.filename} not found in Blob Storage.`);
            return res.status(404).send({
                message: 'Video not found in Blob Storage'
            });
        }

        console.log(`Video with ID ${videoId} retrieved successfully.`);
        emitNotification('videoRetrieveSuccess', { videoId, video });

        res.status(200).send({
            message: 'Video retrieved successfully',
            video: {
                id: videoId,
                filename: video.filename,
                url: videoUrl // Include the URL in the response
            }
        });
    } catch (error) {
        console.error(`Error retrieving video: ${error.message}`);
        res.status(error.message === 'Video not found' ? 404 : 500).send({
            message: error.message
        });
    }
};

// Get video metadata
const getVideoMetadata = (videoId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT filename, videoUrl FROM videos WHERE vid_id = ?';
        connection.query(query, [videoId], (err, results) => {
            if (err) return reject(err);
            if (results.length === 0) return reject(new Error('Video not found'));
            resolve(results[0]);
        });
    });
};

// Multer error handling middleware
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

module.exports = { retrieveVideo, streamVideo, multerErrorHandler, handleVideoUpload ,containerClient,setContainerClient};
