const db = require('../config/db'); // Assuming you have a db connection file

class Submission{
    static create(submissionData, callback){
        db.query('INSERT INTO submission SET ?',{
            submissionID: submissionData.submissionID,
            userID: submissionData.userID,
            assignmentID: submissionData.assignmentID,
            moduleCode: submissionData.moduleCode,
            submissionDate: submissionData.submissionDate,
            videoURL: submissionData.videoURL,
            grade: submissionData.grade,
            feedback: submissionData.feedback
        }, callback);
    }
}

module.exports = Submission;