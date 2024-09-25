const compressVideo = require('./videoCompression'); 
const path = require('path');
 
 const compressVideo = require('./videoCompression');
const path = require('path');

// Imagine `req.file.path` is the dynamically uploaded file from the API request (via Multer)
const inputPath = req.file.path; // Dynamic input path (e.g., uploaded file)
const outputFilename = `compressed_${Date.now()}_${req.file.originalname}`; // Dynamic output filename
const outputPath = path.resolve(__dirname, '../compressed/', outputFilename); // Save to 'compressed' directory

// Run the compression
compressVideo(inputPath, outputPath)
    .then((compressedFilePath) => {
        console.log('Video compressed successfully:', compressedFilePath);

        // Store the compressed file path in the database (as explained in earlier examples)
        const query = 'INSERT INTO video (filename, path, compressed_path, user_id) VALUES (?, ?, ?, ?)';
        db.query(query, [req.file.originalname, inputPath, compressedFilePath, req.body.user_id], (err, result) => {
            if (err) {
                console.error('Error saving to database:', err);
                return res.status(500).json({ message: 'Error saving to database', error: err });
            }
            res.json({
                message: 'Video compressed and saved successfully',
                compressedPath: compressedFilePath
            });
        });
    })
    .catch((error) => {
        console.error('Error compressing video:', error);
        res.status(500).json({ message: 'Error compressing video', error });
    });
