// videoCompression.js
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

function compressVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        const resolvedInputPath = path.resolve(inputPath);
        const resolvedOutputPath = path.resolve(outputPath);

        // Ensure the output directory exists
        const outputDir = path.dirname(resolvedOutputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log(`Compressing video from ${resolvedInputPath} to ${resolvedOutputPath}`);

        ffmpeg(resolvedInputPath)
            .output(resolvedOutputPath)
            .videoCodec('libx264')
            .audioCodec('aac')
            .size('1280x720')
            .on('end', () => {
                console.log('Compression finished successfully');
                fs.unlink(resolvedInputPath, (err) => {
                    if (err) {
                        console.error('Error deleting original file:', err);
                        reject(err);
                    }
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
