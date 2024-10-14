// Routes for assignments will be hosted using express router
const express = require("express");
const router = express.Router();
const { validSubmission, authorizeSubmissionAccess, authorizeFeedbackAccess } = require('../middleware/submissionMiddleware');
// This is the specific functions that are coded in the controller
const SubmissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/auth');

// This is a request to this route path to execute
// This is used to create a new submission 
router.post('/submission', validSubmission, SubmissionController.createSubmission);
router.post('/submission/feedback', SubmissionController.createFeedback);
router.post('/userSubmission', SubmissionController.createUserSubmission);
// This is used to retrieve submission
router.get('/submission/:sub_id', SubmissionController.getSubmission);
// This route is used to retrieve all submissions
router.get('/submissions', SubmissionController.getSubmissions);
// This is used to update submission date
router.put('/submission/:sub_id', SubmissionController.updateSubmissionStudent);
// This is used to remove data
router.delete('/submission/:sub_id', SubmissionController.deleteSubmission);
router.delete('/userSubmission/:user_id/:sub_id', SubmissionController.deleteUserSubmission);
router.delete('/feedSubmission/:feed_id', SubmissionController.deleteFeedback);


// Route to get all video submissions
router.get('/video-submissions',SubmissionController.selectVideoSubmissions);

// This is to export the router

// Get feedback via user_id and assignment_id
router.get('/feedback/:sub_id',authMiddleware, SubmissionController.getFeedbackForSubmission);


module.exports = router;
