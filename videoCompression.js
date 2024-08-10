// videoCompression.js
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');


// Compress video using FFMPEG
function compressVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {

         // Use path module to handle paths safely
         const resolvedInputPath = path.resolve(inputPath);
         const resolvedOutputPath = path.resolve(outputPath);

        ffmpeg(resolvedInputPath)
            .output(resolvedOutputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size('1280x720')
            .on('end', () => {
                fs.unlink(resolvedInputPath, (err) => {
                    if (err) reject(err);
                    resolve(resolvedOutputPath);
                });
            })
            .on('error', (err) => {
                console.error('Error during compression:', err);
                reject(err);
            })
            .run();
    });
}

module.exports = compressVideo;
