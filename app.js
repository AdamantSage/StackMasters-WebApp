const express = require("express");
const path = require("path")
const mysql = require("mysql");
const dotenv = require("dotenv");
//dotenv is what we will use to store passwords basically, hence .env
dotenv.config({path: './.env'})

const app = express();

const db = mysql.createConnection({
//IMP: i can put ip address of cloud server here when its time to move to cloud
    host: process.env.DATABSE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE
});

//we will put files like css/js for frontend we might want to use
const publicDirectory = path.join(__dirname, './public');

//making the app use the files that will be in public folder. i.e style.css

app.use(express.static(publicDirectory))
//will help with views
app.set('view engine', 'hbs');


//connecting to the db
db.connect ( (error) => {
    if(error) {
        console.log(error)
    } else{
        console.log("MYSQL DB Connected!")
    }
})

//this is a get request
//req is request. res is respond
app.get("/", (req, res) => {
    //res.send("<h1>Home Page</h1>")
    res.render("index")
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});