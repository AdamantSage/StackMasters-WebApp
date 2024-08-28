const db = require('../config/db'); // Assuming you have a db connection file

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

    static select(assignmentID, callback){
        db.query('SELECT * FROM assignments WHERE assignmentID = ?', [assignmentID], callback);
    }

    static update(assignmentID, updateData, callback) {
        db.query(
            'UPDATE assignments SET assignmentName = ?, dueDate = ?, assignmentInfo = ? WHERE assignmentID = ?',
            [updateData.assignmentName, updateData.dueDate, updateData.assignmentInfo, assignmentID],
            callback
        );
    }

    static delete(assignmentID, callback){
        db.query('DELETE FROM assignments WHERE assignmentID = ?', [assignmentID], callback);
    }
}
module.exports = Assignment;
