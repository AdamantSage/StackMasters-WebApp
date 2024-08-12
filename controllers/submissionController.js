const mysql = require("mysql");

const db = mysql.createConnection({
    //IMP: You can put the IP address of the cloud server here when it's time to move to the cloud
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
// Create a new submission into the db
exports.createSubmission = (req, res) =>{
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const{
        userID,
        assignmentID,
        moduleCode,
        submissionDate,
        videoURL,
        grade
    } = req.body;
    // Execute the SQL query to insert a new submission into the database
    db.query('INSERT INTO submission SET ?', {
        userID : userID,
        assignmentID : assignmentID,
        moduleCode : moduleCode,
        submissionDate : submissionDate,
        videoURL : videoURL,
        grade : grade
    }, (err, results) => {
        if(err){
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500
            return res.status(500).json({ message: "Error occurred while creating submission."});
        }else{
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 201
            return res.status(201).json({ message: "Submission created successfully." });
        }
    });
}
// Retrieve a specific submission based on ID for user and assignment
exports.getSubmission = (req, res) =>{
    const {assignmentID, userID} = req.params.id; // Retrieve the assignment ID and user ID from the URL
    console.log(`Fetching submission with ID: ${assignmentID}, ${userID}`);
    // Execute the SQL query to fetch the submission with the given ID's
    db.query('SELECT * FROM submission WHERE assignmentID = ? && userID = ?',
    [assignmentID, userID], (err, results) => {
        if(err){
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500
            return res.status(500).json({ message: "Error occurred while fetching submission."});
        }else if(results.length === 0) {
            // If no submission is found, send a JSON response with status code 404
            return res.status(404).json({ message: "Submission not found." });
        }else{
            console.log(results);// Log the results of the query
            // Sends the submission data as JSON with status code 200
            return res.status(200).json(results[0]);
        }
    });
}
//Deletes a specific submission based on the specific user
exports.deleteSubmission = (req, res) =>{
    const {assignmentID, userID} = req.params.id;// Retrieve the assignment ID and user ID from the URL
    console.log(`Deleting submission with ID: ${assignmentID}, ${userID}`);
    // Execute the SQL query to delete the submission with the given IDs
    db.query('DELETE FROM submission WHERE assignmentID = ? && userID = ?', 
    [assignmentID, userID], (err, results) => {
        if(err){
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500
            return res.status(500).json({ message: "Error occured while deleting submission"})
        }else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404
            return res.status(404).json({ message: "Submission not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200
            return res.status(200).json({ message: "Submission deleted successfully." });
        }
    });
};