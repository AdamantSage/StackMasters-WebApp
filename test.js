const compressVideo = require('./videoCompression'); 
const path = require('path');

// Define input and output paths
const inputPath = path.join(__dirname, 'uploads', 'example.mp4');  
const outputPath = path.join(__dirname, 'uploads', 'compressed', 'example.mp4');

// Run the compression
compressVideo(inputPath, outputPath)
    .then((compressedFilePath) => {
        console.log('Video compressed successfully:', compressedFilePath);
    })
    .catch((error) => {
        console.error('Error compressing video:', error);
    });
