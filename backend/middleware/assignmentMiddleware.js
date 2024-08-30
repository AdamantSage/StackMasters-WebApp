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
//exports the function
module.exports = {validAssignmentInfo};