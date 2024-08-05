const mysql = require("mysql");

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

    db.query('SELECT email FROM users WHERE email =?', [email], (error, results) =>
    {
        if(error){
            console.log(error);
        }
        if(results.length> 0){
            return res.render('register', {
                message: "That email has been taken"
            })
        }
        else if(password !== passwordConfirm){
            return res.render('register', {
                message: "passwords do not match"
            })
        }

    });

    res.send("Form submitted");

}