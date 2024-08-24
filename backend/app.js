const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./config/db");  // Import the db module
const dotenv = require("dotenv");

//dotenv is what we will use to store passwords basically, hence .env
dotenv.config({path: './.env'});

const app = express();

//this is a get request
//req is request. res is respond
app.get("/", (req, res) => {
    res.send("<h1>Home Page</h1>")

});

//we will put files like css/js for frontend we might want to use
const publicDirectory = path.join(__dirname, './public');

//making the app use the files that will be in public folder. i.e style.css

app.use(express.static(publicDirectory));
//will help with views

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set('view engine', 'hbs');

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//connecting to the db
db.connect ( (error) => {
    if(error) {
        console.log(error)
    } else{
        console.log("MYSQL DB Connected!")
    }
});

//routes
app.use('/', require('./routes/assignmentsRoutes'));
app.use('/', require('./routes/submissionRoutes'));

app.listen(5000, (err) => {
    if(err){
        console.error("Error starting server:", err)
    }else{
        console.log("Server is running on port 5000");
    }
});
