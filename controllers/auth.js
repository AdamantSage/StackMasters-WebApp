const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    //IMP: i can put ip address of cloud server here when its time to move to cloud
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database:process.env.DATABASE
    });


    exports.register = (req, res) => {
        console.log(req.body);
    
        const { name, email, password, passwordConfirm } = req.body;
    
        db.query('SELECT email FROM users WHERE email =?', [email], (error, results) => {
            if (error) {
                console.log(error);
                return res.render('register', {
                    message: "An error occurred. Please try again."
                });
            }
            if (results.length > 0) {
                return res.render('register', {
                    message: "Existing user, try different details"
                });
            } else if (password !== passwordConfirm) {
                return res.render('register', {
                    message: "Passwords do not match"
                });
            }
    
            // Store password as plain text
            console.log(password);
    
            // Adding user into database with plain text password
            db.query("INSERT INTO users SET ?", { name: name, email: email, password: password }, (error, results) => {
                if (error) {
                    console.log(error);
                    return res.render('register', {
                        message: "An error occurred. Please try again."
                    });
                } else {
                    console.log(results);
                    return res.render('register', {
                        message: "User is registered"
                    });
                }
            });
        });
    }
    

    exports.login = (req, res) => {
        console.log(req.body);
    
        const { email, password } = req.body;
    
        // Check user credentials with plain text password
        db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (error, results) => {
            if (error) {
                console.log(error);
                return res.status(500).send("Server error");
            }
            if (results.length === 0) {
                // Incorrect details
                return res.render('login', {
                    message: "Incorrect details"
                });
            }
    
            // User found and credentials are correct
            const user = results[0];
            
            // Render a welcome page or another view
            return res.render('index', {
                message: "You have been logged in"
            });
        });
    }
    