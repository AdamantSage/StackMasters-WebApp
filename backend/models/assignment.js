const db = require('../config/db'); // Assuming you have a db connection file

class Assignment {
    static create(assignmentData, callback) {
        db.query('INSERT INTO assignment SET ?', {
            assignment_id: assignmentData.assignment_id,
            module_code: assignmentData.module_code,
            assign_name: assignmentData.assign_name,
            upload_date: assignmentData.upload_date,
            due_date: assignmentData.due_date,
            assign_desc: assignmentData.assign_desc,
            user_id: assignmentData.user_id
        }, callback);
    }

    static select(assignment_id, callback){
        db.query('SELECT * FROM assignment WHERE assignment_id = ?', [assignment_id], callback);
    }

    static update(assignment_id, updateData, callback) {
        db.query(
            'UPDATE assignment SET assign_name = ?, due_date = ?, assign_desc = ? WHERE assignment_id = ?',
            [updateData.assign_name, updateData.due_date, updateData.assign_desc, assignment_id],
            callback
        );
    }

    static delete(assignment_id, callback){
        db.query('DELETE FROM assignment WHERE assignment_id = ?', [assignment_id], callback);
    }
}
module.exports = Assignment;
