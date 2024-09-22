//Routes for assignments will be hosted using express router
const express = require("express");
const router = express.Router();
const{validAssignmentInfo, authorizeAssignmentAccess} = require('../middleware/assignmentMiddleware');
//This is the specific functions that are coded in the controller
const AssignmentController = require('../controllers/assignmentController');

//This is a request to this route path to executed
//This is used to create a new assignment 
router.post('/assignment', authorizeAssignmentAccess, validAssignmentInfo, AssignmentController.createAssignment);
router.post('/userAssignment', authorizeAssignmentAccess, AssignmentController.createUserAssignment);
//This is used to retrieve assignment
router.get('/assignment/:id', authorizeAssignmentAccess, AssignmentController.getAssignment);
//this is used to replace data
router.put('/assignment/:id', authorizeAssignmentAccess, AssignmentController.updateAssignment);
//router.put('/userAssignment/:user_id/:assignment_id', AssignmentController.updateUserAssignment);
//this is used to remove data
router.delete('/assignment/:assignment_id', authorizeAssignmentAccess, AssignmentController.deleteAssignment);
router.delete('/userAssignment/:user_id/:assignment_id', authorizeAssignmentAccess, AssignmentController.deleteUserAssignment);
//This is to export the router
module.exports = router;