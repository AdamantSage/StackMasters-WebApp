const Submission = require('../models/Submission');

const db = require('../config/db'); // Assuming you have a db connection file
// Create a new submission into the db
exports.createSubmission = (req, res) =>{
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const{
        submissionID,
        userID,
        assignmentID,
        moduleCode,
        submissionDate,
        videoURL
    } = req.body;
    // Execute the SQL query to insert a new submission into the database
    Submission.create({
        submissionID,
        userID,
        assignmentID,
        moduleCode,
        submissionDate,
        videoURL
        }, (err, results) => {
        if(err){
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while creating submission."});
        }else{
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 201 which means the request is successful
            return res.status(201).json({ message: "Submission created successfully." });
        }
    });
};
// Retrieve a specific submission based on ID for user and assignment
exports.getSubmission = (req, res) =>{
    const {assignmentID, userID} = req.params; // Retrieve the assignment ID and user ID from the URL
    console.log(`Fetching submission with ID: ${assignmentID}, ${userID}`);
    // Execute the SQL query to fetch the submission with the given ID's
    db.query('SELECT * FROM submission WHERE assignmentID = ? && userID = ?',
    [assignmentID, userID], (err, results) => {
        if(err){
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while fetching submission."});
        }else if(results.length === 0) {
            // If no submission is found, send a JSON response with status code 404 which means it could not find
            //the given data in the server
            return res.status(404).json({ message: "Submission not found." });
        }else{
            console.log(results);// Log the results of the query
            // Sends the submission data as JSON with status code 200 which means the request is successful
            return res.status(200).json(results[0]);
        }
    });
};

//Function to re-submit assignment
exports.updateSubmissionStudent = (req, res) =>{
    console.log(req.body);// Log the data sent by the client
    //Extract specific fields from the request body
    const{
        submissionDate,
        videoURL,
        submissionID
    } = req.body;
    //Execute sql query to update the assignment submission done by the student
    db.query('UPDATE submissions SET submissionDate = ?, videoURL = ? WHERE submissionID',
        [submissionDate, videoURL, submissionID], (err, results) => {
            if(err){
                console.log(err);//Log the error occured
                //sends a JSON response with error message and status code 500 which is a server error
                return res.status(500).json({message: "Error occured while re-submitting"});
            }else if(results.affectedRows == 0){
                //sends a JSON response with status code 404 showing no rows were affected with a status code 404
                //which means it could not find the given data in the server
                return res.status(404).json({message: "Submission not found"});
            }else{
                console.log(results);//Logs the results of the updated submission
                //sends a JSON response that submission was updated with a status code 200 which means the request is successful
                return res.status(200).json({message: "Submission updated"});
            }
        });
};
//Function to grade submission
exports.updateSubmissionLecturer = (req, res) =>{
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const{
        grade,
        feedback,
        submissionID
    } = req.body;
    //Execute sql query to update submission
    db.query('UPDATE  Submission SET grade = ?, feedback = ? WHERE submissionID = ?',
        [grade, feedback, submissionID], (err, results) => {
            if(err){
                console.log(err);// Log any errors
                // Send a JSON response with error message and status code 500 which is a server error
                return res.status(500).json({message: "Error occured while grading submission"});
            }else if(results.affectedRows == 0){
                // If no rows were affected, send a JSON response with status code 404 which means it could not find
                //the given data in the server
                return res.status(404).json({message: "Submission not found"});
            }else{
                console.log(results);// Log the results of the query
                // Send a JSON response with success message and status code 200 which means the request is successful
                return res.status(200).json({message: "Submission updated"});
            }
        });
};

//Deletes a specific submission based on the specific user
exports.deleteSubmission = (req, res) =>{
    const {assignmentID, userID} = req.params;// Retrieve the assignment ID and user ID from the URL
    console.log(`Deleting submission with ID: ${assignmentID}, ${userID}`);
    // Execute the SQL query to delete the submission with the given IDs
    db.query('DELETE FROM submission WHERE assignmentID = ? && userID = ?', 
    [assignmentID, userID], (err, results) => {
        if(err){
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occured while deleting submission"})
        }else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404 which means it could not find
            //the given data in the server
            return res.status(404).json({ message: "Submission not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200 which means the request is successful
            return res.status(200).json({ message: "Submission deleted successfully." });
        }
    });
};