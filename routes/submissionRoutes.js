//Routes for assignments will be hosted using express router
const express = require("express");
const router = express.Router();
//This is the specific functions that are coded in the controller
const{
    createSubmission,
    getSubmission,
    deleteSubmission
} = require('../controllers/submissionController');
const { get } = require("./assignmentsRoutes");
//This is a request to this route path to executed
//This is used to create a new submission 
router.post('/submissions', createSubmission);
//This is used to retrieve submission
router.get('/submission/:assignmentId/:userId', getSubmission);
//this is used to remove data
router.delete('/submission/:assignmentId/:userId', deleteSubmission);
//This is to export the router
module.exports = router;