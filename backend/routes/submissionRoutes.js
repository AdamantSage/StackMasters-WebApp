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
router.post('/submission', SubmissionController.createFeedback);
router.post('/submission', SubmissionController.createUserSubmission);
//This is used to retrieve submission
router.get('/submission/:assignmentId/:userId', SubmissionController.getSubmission);
//This is used to grade and update submission done by the lecturer and student
router.put('/submission/:assignmentId/:userId', SubmissionController.updateSubmissionStudent);
//this is used to remove data
router.delete('/submission/:assignmentId/:sub_id', SubmissionController.deleteSubmission);
router.delete('/submission/:assignmentId/:user_id/:sub_id', SubmissionController.deleteUserSubmission);
router.delete('/submission/:assignmentId/:feed_id', SubmissionController.deleteFeedback);
//This is to export the router
module.exports = router;