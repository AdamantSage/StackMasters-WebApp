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

    const { name,role,email, password, passwordConfirm } = req.body;

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
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

        try {
            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log(hashedPassword);

            // Adding user into database with hashed password
            db.query("INSERT INTO users SET ?", { name: name,role: role, email: email, password: hashedPassword }, (error, results) => {
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
        } catch (err) {
            console.log(err);
            return res.render('register', {
                message: "An error occurred while hashing the password. Please try again."
            });
        }
    });
}

    //code used to login user
exports.login = (req, res) => {
    console.log(req.body);

    const { email, password } = req.body;

    // Fetch user by email
    db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Server error");
        }
        if (results.length === 0) {
            // No user found with this email
            return res.render('login', {
                message: "Incorrect details"
            });
        }

        const user = results[0];

        // Compare the provided password with the hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Server error");
            }
            if (isMatch) {
                // Passwords match, user is logged in
                return res.render('index', {
                    message: "You have been logged in"
                });
            } else {
                // Passwords do not match, no access granted
                return res.render('login', {
                    message: "Incorrect details"
                });
            }
        });
    });
}