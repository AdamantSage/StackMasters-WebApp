// videoCompression.js
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');


// Compress video using FFMPEG
function compressVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .output(outputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size('1280x720')
            .on('end', () => {
                fs.unlink(inputPath, (err) => {
                    if (err) reject(err);
                    resolve(outputPath);
                });
            })
            .on('error', (err) => reject(err)) // Handle errors
            .run();
    });
}

module.exports = compressVideo;
