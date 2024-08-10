// app.js
const express = require('express');
require('dotenv').config(); // Load environment variables from .env file

// sets up Express application and define the port number for the server
const app = express();
const port = process.env.PORT || 5000;

// Middleware to handle JSON requests
app.use(express.json()); 

// Basic GET request
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>"); // sends a response with a text message
  });

// Use video upload routes
app.use('/api/videos', require('./routes/videoRoutes'));

  //start server and handle errors
  app.listen(port, (err) => {
    if(err){
        console.error("Error starting server:", err)
    }else{
        console.log(`Server running on port ${port}`);
    }
});

