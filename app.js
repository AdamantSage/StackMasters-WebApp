const express = require("express");
const mysql = require("mysql");
const dotenv = require("dotenv");
//dotenv is what we will use to store passwords basically, hence .env
dotenv.config({path: './.env'})

const app = express();

const db = mysql.createConnection({
//IMP: i can put ip address of cloud server here when its time to move to cloud
    host: 'localhost',
    user: 'root',
    password: '',
    database:'stackmasters_login'
});

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
    res.send("<h1>Home Page</h1>")

});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});