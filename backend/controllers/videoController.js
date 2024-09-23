
const fs = require('fs');
const path = require('path');
const { emitNotification } = require('../NotificationWebSocket.js');
//code for videoSrtreaming
const multer = require('multer');
const http = require('http');
//const { BlobServiceClient } = require('@azure/storage-blob');
const connection = require('../config/database');
require('dotenv/config');


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




// Upload video function
//Post request to hanndle file upload and metadata insertion
// Upload video function
// Post request to handle file upload and metadata insertion
// Upload video function
// Upload video function
const handleVideoUpload = async (req, res) => {
    console.log('Request body:', req.body);

    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    const { originalname, mimetype, size, buffer } = req.file;
    const path = `videos/${originalname}`;
    const blobClient = req.containerClient.getBlockBlobClient(originalname);
    const videoUrl = blobClient.url; // Get the URL for the uploaded video

    try {
        // Upload to Azure Blob Storage
        await blobClient.uploadData(buffer);
        
        const query = 'INSERT INTO videos (filename, path, mimetype, size, uploadAt, videoUrl) VALUES (?, ?, ?, ?, NOW(), ?)';
        const values = [originalname, path, mimetype, size, videoUrl];

        connection.query(query, values, (err) => {
            if (err) {
                console.error('Error inserting video metadata:', err);
                return res.status(500).send({
                    message: 'Error uploading video',
                    error: err.message
                });
            }

            emitNotification('videoUploadSuccess', { filename: originalname, path, mimetype, size, videoUrl });

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


// Retrieve video function
const retrieveVideo = async (req, res) => {
    try {
        const videoId = req.params.id;
        const video = await getVideoMetadata(videoId);
        
        // Now retrieve the video URL directly from the metadata
        const videoUrl = video.videoUrl; // Assuming videoUrl is stored in the database

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



module.exports = {retrieveVideo, streamVideo,multerErrorHandler, handleVideoUpload };

 