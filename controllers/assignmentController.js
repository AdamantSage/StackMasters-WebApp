const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const db = mysql.createConnection({
    //IMP: You can put the IP address of the cloud server here when it's time to move to the cloud
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.createAssignment = (req, res) => {
    console.log(req.body);

    const {
        Module,
        assignmentName,
        uploadDate,
        dueDate,
        assignmentInfo
    } = req.body;

    db.query('INSERT INTO assignments SET ?', {
        Module: Module,
        assignmentName: assignmentName,
        uploadDate: uploadDate,
        dueDate: dueDate,
        assignmentInfo: assignmentInfo
    }, (err, results) => {
        if (err) {
            console.log(err);
            return res.render('assignment', {
                message: "Error occurred."
            });
        }else {
            console.log(results);
            return res.render('assignment', {
                message: "Assignment created"
            });
        }
    });
};

