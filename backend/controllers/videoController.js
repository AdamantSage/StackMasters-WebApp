
const fs = require('fs');
const path = require('path');
const { emitNotification } = require('../NotificationWebSocket.js');
//code for videoSrtreaming


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
const uploadVideo = (req, res) => {
    if (!req.file) {
        console.error('No file uploaded.');
        return res.status(400).send('No file uploaded.');
    }

    // Extract file details
    let { filename, path, mimetype, size } = req.file;

    // Adjust the path variable to reflect the actual upload location
    path = `videos/${filename}`;

    // SQL query to insert video metadata into the database
    const query = 'INSERT INTO videos (filename, path, mimetype, size, uploadAt) VALUES (?, ?, ?, ?, NOW())';
    const values = [filename, path, mimetype, size];

    connection.query(query, values, (err, results) => {
        if (err) {
            console.error('Error inserting video metadata:', err);
            return res.status(500).send({
                message: 'Error uploading file',
                error: err.message
            });
        }

        // Log the upload details to the console
        /*console.log(`Uploaded file: ${filename}`);
        console.log(`File path: ${path}`);
        console.log(`MIME type: ${mimetype}`);
        console.log(`File size: ${size} bytes`);
        console.log("file uploaded successfuly, locally.");*/

         // Emit success event
        emitNotification('videoUploadSuccess', { filename, path, mimetype, size});

        // Send a response back to the client
        res.status(201).send({
            message: 'File uploaded successfully',
            file: req.file
        });
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



module.exports = { uploadVideo, retrieveVideo, streamVideo,multerErrorHandler  };

 