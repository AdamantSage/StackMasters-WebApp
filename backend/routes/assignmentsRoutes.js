//Routes for assignments will be hosted using express router
const express = require("express");
const router = express.Router();
const{validAssignmentInfo} = require('../middleware/assignmentMiddleware');
//This is the specific functions that are coded in the controller
const AssignmentController = require('../controllers/assignmentController');

//This is a request to this route path to executed
//This is used to create a new assignment 
router.post('/assignment', validAssignmentInfo, AssignmentController.createAssignment);
router.post('/assignment', AssignmentController.createUserAssignment);
//This is used to retrieve assignment
router.get('/assignment/:id', AssignmentController.getAssignment);
//this is used to replace data
router.put('/assignment/:id', validAssignmentInfo, AssignmentController.updateAssignment);
router.put('/assignment/:id', AssignmentController.updateUserAssignment);
//this is used to remove data
router.delete('/assignment/:id', AssignmentController.deleteAssignment);
router.delete('/assignment/:id', AssignmentController.deleteUserAssignment);
//This is to export the router
module.exports = router;