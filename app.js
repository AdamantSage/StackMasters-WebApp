
const express = require('express');
const mysql = require('mysql2');

//This code will upload file to a local folder for now 
const app = express();

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
app.get('/', function(req, res){
    res.send("hey there, it works atm");
});

// Start the server
app.listen(5000, function(){
    console.log("Server running on port 5000");
});
