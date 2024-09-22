//Routes for assignments will be hosted using express router
const express = require("express");
const router = express.Router();
const{validSubmission, authorizeSubmissionAccess, authorizeFeedbackAccess} = require('../middleware/submissionMiddleware');
//This is the specific functions that are coded in the controller
const SubmissionController = require('../controllers/submissionController');
const { get } = require("./assignmentsRoutes");
//This is a request to this route path to executed
//This is used to create a new submission 
router.post('/submission', validSubmission, SubmissionController.createSubmission);
router.post('/submission/feedback', authorizeFeedbackAccess, SubmissionController.createFeedback);
router.post('/userSubmission', authorizeSubmissionAccess, SubmissionController.createUserSubmission);
//This is used to retrieve submission
router.get('/submission/:sub_id', authorizeSubmissionAccess, SubmissionController.getSubmission);
//This is used to update submission date
router.put('/submission/:sub_id', authorizeSubmissionAccess, SubmissionController.updateSubmissionStudent);
//this is used to remove data
router.delete('/submission/:sub_id', authorizeSubmissionAccess, SubmissionController.deleteSubmission);
router.delete('/userSubmission/:user_id/:sub_id', authorizeSubmissionAccess, SubmissionController.deleteUserSubmission);
router.delete('/feedSubmission/:feed_id', authorizeFeedbackAccess, SubmissionController.deleteFeedback);
//This is to export the router
module.exports = router;