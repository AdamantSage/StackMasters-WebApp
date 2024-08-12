const mysql = require("mysql");

const db = mysql.createConnection({
    //IMP: You can put the IP address of the cloud server here when it's time to move to the cloud
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
// Create a new assignment
exports.createAssignment = (req, res) => {
    console.log(req.body); // Log the data sent by the client
    // Extract specific fields from the request body
    const {
        assignmentID,
        moduleCode,
        assignmentName,
        uploadDate,
        dueDate,
        assignmentInfo
    } = req.body;
    // Execute the SQL query to insert a new assignment into the database
    db.query('INSERT INTO assignments SET ?', {
        assignmentID: assignmentID,
        moduleCode: moduleCode,
        assignmentName: assignmentName,
        uploadDate: uploadDate,
        dueDate: dueDate,
        assignmentInfo: assignmentInfo
    }, (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500
            return res.status(500).json({ message: "Error occurred while creating assignment." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 201
            return res.status(201).json({ message: "Assignment created successfully." });
        }
    });
};
// Retrieve a specific assignment based on ID
exports.getAssignment = (req, res) => {
    const assignmentID = req.params.id; // Retrieve the assignment ID from the URL
    console.log(`Fetching assignment with ID: ${assignmentID}`);
    // Execute the SQL query to fetch the assignment with the given ID
    db.query('SELECT * FROM assignments WHERE assignmentID = ?', [assignmentID], (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500
            return res.status(500).json({ message: "Error occurred while fetching assignment." });
        } else if (results.length === 0) {
            // If no assignment is found, send a JSON response with status code 404
            return res.status(404).json({ message: "Assignment not found." });
        } else {
            console.log(results); // Log the results of the query
            // Sends the assignment data as JSON with status code 200
            return res.status(200).json(results[0]);
        }
    });
};
// Update an existing assignment
exports.updateAssignment = (req, res) => {
    console.log(req.body); // Log the data sent by the client
    // Extract specific fields from the request body
    const {
        assignmentID,
        assignmentName,
        dueDate,
        assignmentInfo
    } = req.body;
    // Execute the SQL query to update the assignment with the given ID
    db.query('UPDATE assignments SET assignmentName = ?, dueDate = ?, assignmentInfo = ? WHERE assignmentID = ?',
       [assignmentName, dueDate, assignmentInfo, assignmentID], (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500
            return res.status(500).json({ message: "Error occurred while updating assignment." });
        } else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404
            return res.status(404).json({ message: "Assignment not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200
            return res.status(200).json({ message: "Assignment updated successfully." });
        }
    });
};
//Defines the function which is exported and used as a route handler
exports.deleteAssignment = (req, res) => {
    const assignmentID = req.params.id; // Retrieve the assignment ID from the URL
    console.log(`Deleting assignment with ID: ${assignmentID}`);

    // Execute the SQL query to delete the assignment with the given ID
    db.query('DELETE FROM assignments WHERE assignmentID = ?', [assignmentID], (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500
            return res.status(500).json({ message: "Error occurred while deleting assignment." });
        } else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404
            return res.status(404).json({ message: "Assignment not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200
            return res.status(200).json({ message: "Assignment deleted successfully." });
        }
    });
};

  