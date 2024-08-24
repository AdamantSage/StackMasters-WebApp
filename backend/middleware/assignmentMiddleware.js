//function validate when a assignment is created, are these variables in the database
const validAssignmentInfo = (req, res, next) => {
    console.log(req.body);// Log the data sent by the client
    // Extract specific fields from the request body
    const {
        assignmentID,
        moduleCode,
        assignmentName,
        uploadDate,
        dueDate,
        assignmentInfo
    } = req.body;
    if(!assignmentID || !moduleCode || !assignmentName || !uploadDate ||
        !dueDate || !assignmentInfo){
            //returns a JSON response that there are missing fields
            return res.status(400).json({message: 'Missing required fields'});
        }
    next();
}
//exports the function
module.exports = {validAssignmentInfo};