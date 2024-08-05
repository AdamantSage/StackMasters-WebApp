const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    //IMP: i can put ip address of cloud server here when its time to move to cloud
        host: process.env.DATABSE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database:process.env.DATABASE
    });


exports.register =(req, res) =>
{
    console.log(req.body);

    const {name,  email, password, passwordConfirm} = req.body;

    db.query('SELECT email FROM users WHERE email =?', [email], async (error, results) =>
    {
        if(error){
            console.log(error);
        }
        if(results.length> 0){
            return res.render('register', {
                message: "Existing user, try different details"
            })
        }
        else if(password !== passwordConfirm){
            return res.render('register', {
                message: "passwords do not match"
            });
        }

        //passsword will has password 8 times
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        //adding user into database with secure hashed password
        db.query("INSERT INTO users SET ?", {name: name,email: email,password: hashedPassword}, (error, results) => {
            if(error){
                console.log(error);
            }
            else
            {
                console.log(results);
                return res.render('register', {
                    message: "User is registered"
                });
            }
        })
    });

}