const Submission = require('../models/submission');

const db = require('../config/database'); // Assuming you have a db connection file
// Create a new submission into the db
exports.createSubmission = (req, res) =>{
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const{
        sub_id,
        sub_date,
        assignment_id
    } = req.body;
    // Execute the SQL query to insert a new submission into the database
    Submission.create({
        sub_id,
        sub_date,
        assignment_id
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
        module_code,
    } = req.body;
    // Execute the SQL query to insert a new submission into the database
    Submission.createUserSubmission({
        user_id,
        sub_id,
        module_code,
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
// Retrieve a specific submission based on ID for user and submission
exports.getSubmission = (req, res) =>{
    const {sub_id} = req.params; // Retrieve the submission ID and user ID from the URL
    console.log(`Fetching submission with ID: ${sub_id}, ${user_id}`);
    // Execute the SQL query to fetch the submission with the given ID's
    Submission.selectSubmission(sub_id, (err, results) => {
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
    const sub_id = req.params.id;
    const{
        sub_date,
    } = req.body;
    //Execute sql query to update the assignment submission done by the student
    Submission.updateStudent(sub_id, {sub_date}, (err, results) => {
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
                return res.status(404).json({message: "Feedback could not be found"});
            }else{
                console.log(results);// Log the results of the query
                // Send a JSON response with success message and status code 200 which means the request is successful
                return res.status(200).json({message: "Feedback created"});
            }
        });
};

//Deletes a specific submission based on the specific user
exports.deleteSubmission = (req, res) =>{
    const {sub_id} = req.params;// Retrieve the assignment ID and user ID from the URL
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
    const {user_id, sub_id} = req.params;// Retrieve the assignment ID and user ID from the URL
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

exports.getSubmissions = (req, res) => {
    console.log(`Fetching all submissions`);

    // Execute the SQL query to fetch all submissions
    Submission.selectAllSubmissions((err, results) => {
        if (err) {
            console.error(err); // Log any errors
            // Send a JSON response with error message and status code 500 (server error)
            return res.status(500).json({ message: "Error occurred while fetching submissions." });
        } else if (results.length === 0) {
            // If no submissions are found, send a JSON response with status code 404 (not found)
            return res.status(404).json({ message: "No submissions found." });
        } else {
            console.log(results); // Log the results of the query
            // Send the submissions data as JSON with status code 200 (success)
            return res.status(200).json(results);
        }
    });
};


exports.deleteFeedback = (req, res) =>{
    const {feed_id} = req.params;// Retrieve the feed_id from the URL
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

exports.selectVideoSubmissions = (req, res) => {
    console.log(`Fetching video submissions`);

    // Execute the SQL query to fetch all video submissions
    Submission.selectVideoSubmissions((err, results) => {
        if (err) {
            console.error(err); // Log any errors
            // Send a JSON response with error message and status code 500 (server error)
            return res.status(500).json({ message: "Error occurred while fetching video submissions." });
        } else if (results.length === 0) {
            // If no submissions are found, send a JSON response with status code 404 (not found)
            return res.status(404).json({ message: "No video submissions found." });
        } else {
            console.log(results); // Log the results of the query
            // Send the submissions data as JSON with status code 200 (success)
            return res.status(200).json(results);
        }
    });
};


exports.deleteUserSubmission

exports.getFeedbackForSubmission = (req, res) => {
    const { sub_id } = req.params;

    if (!sub_id) {
        return res.status(400).json({ message: "Submission ID is required." });
    }

    const user_id = req.user.id; // Ensure this is set in middleware

    console.log('Fetching feedback for user:', user_id, 'and submission:', sub_id);

    const feedbackQuery = `
        SELECT f.*
        FROM feedback f
        JOIN submission s ON f.assignment_id = s.assignment_id
        JOIN user_on_submission u ON u.sub_id = s.sub_id
        WHERE u.user_id = ? AND s.sub_id = ?;
    `;

    db.query(feedbackQuery, [user_id, sub_id], (err, feedbackResults) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Error fetching feedback.", error: err.message });
        }

        if (feedbackResults.length === 0) {
            return res.status(404).json({ message: "No feedback found for this user and submission." });
        }

        return res.status(200).json({ feedback: feedbackResults });
    });
};
