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

    static select(submissionData, callback){
        db.query('SELECT * FROM submission WHERE assignmentID = ? && userID = ?', {
            assignmentID: submissionData.assignmentID,
            userID: submissionData.userID
        }, callback);
    }

    static updateStudent(submissionID, updateData, callback){
        db.query('UPDATE submissions SET submissionDate = ?, videoURL = ? WHERE submissionID',
            [updateData.submissionDate, updateData.videoURL, submissionID], callback);
    }

    static updateLecture(submissionID, updateData, callback){
        db.query('UPDATE  Submission SET grade = ?, feedback = ? WHERE submissionID = ?',
            [updateData.grade, updateData.feedback, submissionID], callback);
    }

    static delete(assignmentID, userID, callback){
        db.query('DELETE FROM submission WHERE assignmentID = ? && userID = ?', 
            [assignmentID, userID], callback);
    }
}

module.exports = Submission;