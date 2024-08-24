//Routes for assignments will be hosted using express router
const express = require("express");
const router = express.Router();
const{validSubmission} = require('../middleware/submissionMiddleware');
//This is the specific functions that are coded in the controller
const SubmissionController = require('../controllers/submissionController');
const { get } = require("./assignmentsRoutes");
//This is a request to this route path to executed
//This is used to create a new submission 
router.post('/submission', validSubmission, SubmissionController.createSubmission);
//This is used to retrieve submission
router.get('/submission/:assignmentId/:userId', SubmissionController.getSubmission);
//This is used to grade and update submission done by the lecturer and student
router.put('/submission/:assignmentId/:userId', SubmissionController.updateSubmissionStudent);
router.put('/submission/:assignmentId/:userId', SubmissionController.updateSubmissionLecturer);
//this is used to remove data
router.delete('/submission/:assignmentId/:userId', SubmissionController.deleteSubmission);
//This is to export the router
module.exports = router;