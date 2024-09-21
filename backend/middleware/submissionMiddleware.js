//function validate when a submission is created, are these variables in the database
const validSubmission = (req, res, next) =>{
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const{
        sub_id,
        sub_date,
        assignment_id,
    } = req.body;
    if(!sub_id || !sub_date || !assignment_id){
            //returns a JSON response that there are missing fields
            return res.status(400).json({message: 'Missing required fields'});
        }
    next();
};

const authorizeSubmissionAccess = (req, res, next) => {
    const sub_id = req.params.id; // Get sub ID from request parameters
    const user_id = req.user.id; // Get user ID from authenticated user

    Submission.select(sub_id, user_id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error occurred while checking subission access.' });
        } else if (results.length === 0) {
            return res.status(404).json({ message: 'Submission not found or access denied.' });
        } else {
            // Assignment belongs to the user, proceed to next middleware/controller
            next();
        }
    });
};

const authorizeFeedbackAccess = (req, res, next) => {
    const feed_id = req.params.id; // Get sub ID from request parameters
    const user_id = req.user.id; // Get user ID from authenticated user

    Submission.selectFeed(feed_id, user_id, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error occurred while checking feedback access.' });
        } else if (results.length === 0) {
            return res.status(404).json({ message: 'feedback not found or access denied.' });
        } else {
            // Assignment belongs to the user, proceed to next middleware/controller
            next();
        }
    });
};

//exports the function
module.exports = {validSubmission, authorizeSubmissionAccess, authorizeFeedbackAccess};