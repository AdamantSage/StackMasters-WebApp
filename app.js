// app.js
const express = require('express');
require('dotenv').config();

// sets up Express application and define the port number for the server
const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle JSON requests
app.use(express.json());

// Use video upload routes
app.use('/api/videos', require('./routes/videoRoutes'));

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
