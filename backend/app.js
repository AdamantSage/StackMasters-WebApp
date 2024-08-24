const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
<<<<<<< HEAD
const db = require("./db");  // Import the db module
const dotenv = require("dotenv");

dotenv.config({ path: './.env' });

const app = express();

=======
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

>>>>>>> Lux_Branch
//we will put files like css/js for frontend we might want to use
const publicDirectory = path.join(__dirname, './public');

//making the app use the files that will be in public folder. i.e style.css

<<<<<<< HEAD
app.use(express.static(publicDirectory))
=======
app.use(express.static(publicDirectory));
>>>>>>> Lux_Branch
//will help with views

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.set('view engine', 'hbs');

<<<<<<< HEAD


// Error handling middleware
=======
>>>>>>> Lux_Branch
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

<<<<<<< HEAD
//define routes
app.use('/', require('./routes/pages'));
app.use('/users', require('./routes/users'));


app.listen(5000, () => {
    console.log("Server is running on port 5000");
=======
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
>>>>>>> Lux_Branch
});
