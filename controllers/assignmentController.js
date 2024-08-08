const mysql = require("mysql");

const db = mysql.createConnection({
    //IMP: You can put the IP address of the cloud server here when it's time to move to the cloud
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
//Defines the function which is exported and used as a route handler
exports.createAssignment = (req, res) => {
    //This logs the data sent by the client
    console.log(req.body);
    //this extracts specific fields from the req.body
    const {
        assignmentID,
        ModuleCode,
        assignmentName,
        uploadDate,
        dueDate,
        assignmentInfo
    } = req.body;
    //this executes the sql query using client values
    db.query('INSERT INTO assignments SET ?', {
        assignmentID : assignmentID,
        ModuleCode: ModuleCode,
        assignmentName: assignmentName,
        uploadDate: uploadDate,
        dueDate: dueDate,
        assignmentInfo: assignmentInfo
    }, (err, results) => {
        //error handaling by checking if there is a error
        if (err) {
            console.log(err);
            //This sends a message to client that error has occured
            return res.render('assignments', {
                message: "Error occurred."
            });
        }else {
            console.log(results);
            //this displays to the client there was no error
            return res.render('assignments', {
                message: "Assignment created"
            });
        }
    });
};
//Defines the function which is exported and used as a route handler
exports.getAssignment = (req, res) => {
    //This logs the data sent by the client
    console.log(req.body);
    //this extracts specific fields from the req.body
    const {
        assignmentID,
    } = req.body;
    //this executes the sql query using client values
    db.query('SELECT * FROM assignmnets WHERE assignmentID =?', 
        [assignmentID], (err, results) => {
            //error handaling by checking if there is a error
            if(err){
                console.log(err);
                //This sends a message to client that error has occured
                return res.render('assignments', {
                    message: "Error occurred."
                });
            }else{
                console.log(results);
                //this displays to the client there was no error
                return res.render('assignments', {
                    message: "Assignment viewed"
                });
            }
        });
}
//Defines the function which is exported and used as a route handler
exports.updateAssignment = (req, res) => {
    //This logs the data sent by the client
    console.log(req.body);
    //this extracts specific fields from the req.body
    const{
        ModuleCode,
        assignmentName,
        dueDate,
        assignmentInfo
    } = req.body;
    //this executes the sql query using client values
    db.query('UPDATE assignments WHERE assignmentID ?', 
       [assignmentID], (err, results) => {
        //error handaling by checking if there is a error
        if(err){
            console.log(err);
            //This sends a message to client that error has occured
            return res.render('assignments',{
                message: "Error occured."
            });
        }else{
            console.log(results);
            //this displays to the client there was no error
            return res.render('assignments', {
                message: "View assignment"
            });
        }
    });
}
//Defines the function which is exported and used as a route handler
exports.deleteAssignment = (req, res) => {
    //This logs the data sent by the client
    console.log(req.body);
    //this extracts specific fields from the req.body
    const{
        assignmentID,
    } = req.body;
    //this executes the sql query using client values
    db.query('DELETE FROM assignment WHERE ?',
        [assignmentID], (err, results) => {
            //error handaling by checking if there is a error
            if(err){
                console.log(err);
                //This sends a message to client that error has occured
                return res.render('assignment', {
                    message: "Error occured."
                });
            }else{
                console.log(results);
                //this displays to the client there was no error
                return res.render('assignment', {
                    message: "Deleted assignment"
                });
            }
        });
}

