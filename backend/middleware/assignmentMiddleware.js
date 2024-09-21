//function validate when a assignment is created, are these variables in the database
const validAssignmentInfo = (req, res, next) => {
    console.log(req.body);// Log the data sent by the client
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
    if(!assignment_id || !module_code || !assign_name || !upload_date ||
        !due_date || !assign_desc || !user_id){
            //returns a JSON response that there are missing fields
            return res.status(400).json({message: 'Missing required fields'});
        }
    next();
}

const authorizeAssignmentAccess = (req, res, next) => {
    const assignment_id = req.params.id; // Get assignment ID from request parameters
    const user_id = req.user.id; // Get user ID from authenticated user

    Assignment.select(assignment_id, user_id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error occurred while checking assignment access.' });
        } else if (results.length === 0) {
            return res.status(404).json({ message: 'Assignment not found or access denied.' });
        } else {
            // Assignment belongs to the user, proceed to next middleware/controller
            next();
        }
    });
};

//exports the function
module.exports = {validAssignmentInfo, authorizeAssignmentAccess};