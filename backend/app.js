const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./config/database");  // Import the db module
const dotenv = require("dotenv");
const { setContainerClient } = require('./controllers/videoController'); // Import the middleware
dotenv.config();
const cors = require('cors');
const app = express();

// Update CORS to allow requests from your Azure web app only
const allowedOrigins = [
    'https://hmsstackmasters-hvfcb8drb4d0egf8.southafricanorth-01.azurewebsites.net', // Your Azure web app URL
    // You can also add localhost if you need to test locally
    'http://localhost:5000' // Optional: allow localhost for development
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS')); // Reject the request
        }
    },
}));

//we will put files like css/js for frontend we might want to use
const publicDirectory = path.join(__dirname, './public');

//making the app use the files that will be in public folder. i.e style.css
app.use(express.static(publicDirectory));
//will help with views
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'hbs');

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use(setContainerClient); // This should be called before defining routes

//define routes
app.use('/', require('./routes/pages'));
app.use('/users', require('./routes/users'));
app.use('/', require('./routes/assignmentsRoutes'));
app.use('/', require('./routes/submissionRoutes'));
app.use('/routes', require('./routes/videoRoutes'));

// Start the server
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
