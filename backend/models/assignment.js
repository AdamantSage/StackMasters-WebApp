const db = require('../config/database'); // Assuming you have a db connection file

class Assignment {
    static create(assignmentData, callback) {
        db.query('INSERT INTO assignments SET ?', {
            assignmentID: assignmentData.assignmentID,
            moduleCode: assignmentData.moduleCode,
            assignmentName: assignmentData.assignmentName,
            uploadDate: assignmentData.uploadDate,
            dueDate: assignmentData.dueDate,
            assignmentInfo: assignmentData.assignmentInfo
        }, callback);
    }
}

module.exports = Assignment;
