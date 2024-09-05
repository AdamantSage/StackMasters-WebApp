const Assignment = require('../models/assignment');

const db = require('../config/db'); // Assuming you have a db connection file
// Create a new assignment
exports.createAssignment = (req, res) => {
    console.log(req.body); // Log the data sent by the client
    // Extract specific fields from the request body
    const {
        assignment_id,
        module_code,
        assign_name,
        upload_date,
        due_date,
        assign_desc,
        user_id
    } = req.body;
    // Execute the SQL query to insert a new assignment into the database
    Assignment.create({
        assignment_id,
        module_code,
        assign_name,
        upload_date,
        due_date,
        assign_desc,
        user_id
    }, (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while creating assignment." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 201 which means it create the assignment
            return res.status(201).json({ message: "Assignment created successfully." });
        }
    });
};

exports.createUserAssignment = (req, res) => {
    console.log(req.body); // Log the data sent by the client
    // Extract specific fields from the request body
    const {
        user_id,
        assignment_id,
        module_code
    } = req.body;
    // Execute the SQL query to insert a new assignment into the database
    Assignment.createUserAssignment({
        user_id,
        assignment_id,
        module_code
    }, (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while creating assignment." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 201 which means it create the assignment
            return res.status(201).json({ message: "Assignment created successfully." });
        }
    });
};
// Retrieve a specific assignment based on ID
exports.getAssignment = (req, res) => {
    const assignment_id = req.params.id; // Retrieve the assignment ID from the URL
    console.log(`Fetching assignment with ID: ${assignment_id}`);
    // Execute the SQL query to fetch the assignment with the given ID from the model
    Assignment.select(assignment_id, (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while fetching assignment." });
        } else if (results.length === 0) {
            // If no assignment is found, send a JSON response with status code 404 which means it could not find
            //the given data in the server
            return res.status(404).json({ message: "Assignment not found." });
        } else {
            console.log(results); // Log the results of the query
            // Sends the assignment data as JSON with status code 200 which means the request is successful
            return res.status(200).json(results[0]);
        }
    });
};
// Update an existing assignment
exports.updateAssignment = (req, res) => {
    console.log(req.body); // Log the data sent by the client
    const assignment_id = req.params.id;
    // Extract specific fields from the request body
    const {
        assign_name,
        due_date,
        assign_desc
    } = req.body;
    Assignment.update(assignment_id,
        {
        assign_name,
        due_date,
        assign_desc
    }, (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while updating assignment." });
        } else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404 which means it could not find
            //the given data in the server
            return res.status(404).json({ message: "Assignment not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200 which means the request is successful
            return res.status(200).json({ message: "Assignment updated successfully." });
        }
    });
};

exports.updateUserAssignment = (req, res) => {
    console.log(req.body); // Log the data sent by the client
    // Extract specific fields from the request body
    const {user_id, assignment_id} = req.params;
    const {
        module_code
    } = req.body;
    Assignment.updateUserAssignment(user_id, assignment_id,{
        module_code
    }, (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while updating assignment." });
        } else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404 which means it could not find
            //the given data in the server
            return res.status(404).json({ message: "Assignment not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200 which means the request is successful
            return res.status(200).json({ message: "Assignment updated successfully." });
        }
    });
};
//Defines the function which is exported and used as a route handler
exports.deleteAssignment = (req, res) => {
    const assignment_id = req.params.id; // Retrieve the assignment ID from the URL
    console.log(`Deleting assignment with ID: ${assignment_id}`);

    // Execute the SQL query to delete the assignment with the given ID from the model
    Assignment.delete([assignment_id], (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while deleting assignment." });
        } else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404 which means it could not find
            //the given data in the server
            return res.status(404).json({ message: "Assignment not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200 which means the request is successful
            return res.status(200).json({ message: "Assignment deleted successfully." });
        }
    });
};
exports.deleteUserAssignment = (req, res) => {
    const {user_id, assignment_id} = req.params.id; // Retrieve the IDs from the URL
    console.log(`Deleting assignment with IDs: ${user_id}, ${assignment_id}`);

    // Execute the SQL query to delete the assignment with the given ID from the model
    Assignment.deleteUserAssignment([user_id,assignment_id], (err, results) => {
        if (err) {
            console.log(err); // Log any errors
            // Send a JSON response with error message and status code 500 which is a server error
            return res.status(500).json({ message: "Error occurred while deleting assignment." });
        } else if (results.affectedRows === 0) {
            // If no rows were affected, send a JSON response with status code 404 which means it could not find
            //the given data in the server
            return res.status(404).json({ message: "Assignment not found." });
        } else {
            console.log(results); // Log the results of the query
            // Send a JSON response with success message and status code 200 which means the request is successful
            return res.status(200).json({ message: "Assignment deleted successfully." });
        }
    });
};
  