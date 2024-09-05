const Submission = require('../models/submission');

const db = require('../config/db'); // Assuming you have a db connection file
// Create a new submission into the db
exports.createSubmission = (req, res) =>{
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const{
        sub_id,
        sub_date,
        assignment_id,
        feed_id
    } = req.body;
    // Execute the SQL query to insert a new submission into the database
    Submission.create({
        sub_id,
        sub_date,
        assignment_id,
        feed_id
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
exports.createUserSubmission = (req, res) =>{
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const{
        user_id,
        sub_id,
        module_code
    } = req.body;
    // Execute the SQL query to insert a new submission into the database
    Submission.createUserSubmission({
        user_id,
        sub_id,
        module_code
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
    const {sub_id} = req.params.id; // Retrieve the assignment ID and user ID from the URL
    console.log(`Fetching submission with ID: ${sub_id}`);
    // Execute the SQL query to fetch the submission with the given ID's
    Submission.select(assignmentID, userID, (err, results) => {
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
        sub_date,
    } = req.body;
    //Execute sql query to update the assignment submission done by the student
    Submission.updateStudent({sub_date, sub_id}, (err, results) => {
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
exports.createFeedback = (req, res) =>{
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const{
        feed_id,
        user_id,
        assignment_id,
        description,
        grade
    } = req.body;
    //Execute sql query to update submission
    Submission.createLectureFeedback(
        {   feed_id,
            user_id,
            assignment_id,
            description,
            grade
        }, (err, results) => {
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
    const sub_id = req.params.id;// Retrieve the assignment ID and user ID from the URL
    console.log(`Deleting submission with ID: ${sub_id}`);
    // Execute the SQL query to delete the submission with the given IDs
    Submission.deleteSubmission(
    [sub_id], (err, results) => {
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

exports.deleteUserSubmission = (req, res) =>{
    const {user_id, sub_id} = req.params.id;// Retrieve the assignment ID and user ID from the URL
    console.log(`Deleting submission with ID: ${user_id}, ${sub_id}`);
    // Execute the SQL query to delete the submission with the given IDs
    Submission.deleteUserSubmission(
    [user_id, sub_id], (err, results) => {
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

exports.deleteFeedback = (req, res) =>{
    const feed_id = req.params.id;// Retrieve the assignment ID and user ID from the URL
    console.log(`Deleting submission with ID: ${feed_id}`);
    // Execute the SQL query to delete the submission with the given IDs
    Submission.deleteFeedback(
    [feed_id], (err, results) => {
        if(err){
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occured while deleting feedback"})
        }else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404 which means it could not find
            //the given data in the server
            return res.status(404).json({ message: "feedback not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200 which means the request is successful
            return res.status(200).json({ message: "feedback deleted successfully." });
        }
    });
};

exports.deleteUserSubmission