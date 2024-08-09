const express = require('express');
const videoRoutes = require('./routes/videoRoutes');
require('dotenv').config();

//This code will upload file to a local folder for now 
const multer = require('multer');
const path = require('path');

const mysql = require('mysql');


const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle JSON requests
app.use(express.json());

// Use video upload routes
app.use('/routes', require('./routes/videoRoutes'));

//Set up Multer storage
/*const videoStorage = multer.diskStorage({
    destination: 'videos', // Destination to store video 
    filename: (req, file, cb) => {
        const uniqueName = file.fieldname + '_' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});
const upload = multer({ storage: videoStorage });*/

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
