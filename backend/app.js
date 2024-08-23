const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./db");  // Import the db module
const dotenv = require("dotenv");

dotenv.config({ path: './.env' });

const app = express();

//we will put files like css/js for frontend we might want to use
const publicDirectory = path.join(__dirname, './public');

//making the app use the files that will be in public folder. i.e style.css

app.use(express.static(publicDirectory))
//will help with views

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set('view engine', 'hbs');



// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//define routes
app.use('/', require('./routes/pages'));
app.use('/users', require('./routes/users'));


app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
