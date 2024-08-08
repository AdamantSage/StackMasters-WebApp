//Routes for assignments will be hosted using express router
const express = require("express");
const router = express.Router();
const{validAssignmentInfo} = require('./middleware/assignmentMiddleware');
//This is the specific functions that are coded in the controller
const{  
    createAssignment,
    getAssignment,
    updateAssignment,
    deleteAssignment
} = require('./controllers/assignmentController');

//This is a request to this route path to executed
//This is used to create a new assignment 
router.post('/', validAssignmentInfo , createAssignment);
//This is used to retrieve assignment
router.get('/', getAssignment);
//this is used to replace data
router.put('/', validAssignmentInfo, updateAssignment);
//this is used to remove data
router.delete('/', deleteAssignment);
//This is to export the router
module.exports = router;