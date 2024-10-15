const db = require('../config/database'); // Assuming you have a db connection file

class Submission{
    static create(submissionData, callback){
        db.query('INSERT INTO submission SET ?',{
            sub_date: submissionData.sub_date,
            assignment_id: submissionData.assignment_id,
        }, callback);
    }

    static createUserSubmission(submissionData, callback){
        db.query('INSERT INTO user_on_submission SET ?', {
            user_id: submissionData.user_id,
            sub_id: submissionData.sub_id,
            module_code: submissionData.module_code
        }, callback);

    }

    static select(sub_id, user_id, callback){
        db.query('SELECT * FROM user_on_submission WHERE sub_id = ? AND user_id = ?',
            [sub_id, user_id], callback);
    }

    static selectSubmission(sub_id, callback){
        db.query('SELECT * FROM submission WHERE sub_id = ?',
            [sub_id], callback);
    }

    static selectAllSubmissions(callback){
        db.query('SELECT * FROM submission', callback); 
    }

    static updateStudent(sub_id, updateData, callback){
        db.query('UPDATE submission SET sub_date = ? WHERE sub_id',
            [updateData.sub_date, sub_id], callback);
    }

    static createLectureFeedback(feedbackData, callback){
        db.query('INSERT INTO feedback SET ?',
            {
                feed_id: feedbackData.feed_id,
                user_id: feedbackData.user_id,
                assignment_id: feedbackData.assignment_id,
                description: feedbackData.description,
                grade: feedbackData.grade,
                sub_id: feedbackData.sub_id
            }, callback);
    }

    static selectFeed(sub_id, user_id, callback){
        db.query('SELECT * FROM feedback WHERE feed_id = ? AND user_id = ?',
            [sub_id, user_id], callback);
    }

    static deleteSubmission(sub_id, callback){
        db.query('DELETE FROM submission WHERE sub_id = ?', 
            [sub_id], callback);
    }

    static deleteUserSubmission(user_id, sub_id, callback){
        db.query('DELETE FROM user_on_submission WHERE user_id = ?, sub_id = ?',
            [user_id, sub_id], callback
        );
    }

    static deleteFeedback(feed_id, callback){
        db.query('DELETE FROM feedback WHERE feed_id = ?',
            [feed_id], callback
        );
    }

    static selectVideoSubmissions(callback) {
        const query =`
            SELECT 
                s.sub_id, a.assign_name,u.user_id,a.upload_date,a.assignment_id, v.videoUrl
            FROM 
                videos v
            JOIN 
                users u ON v.user_id = u.user_id
            JOIN 
                assignment a ON a.user_id = u.user_id
            JOIN 
                submission s ON s.assignment_id= a.assignment_id;`;
          
        db.query(query, callback);
    }
    //selectVideoSubmissions and selectVideoSubmissions all, is not the same?
    //Dont alter selectVideoSubmissions.
    
    static selectVideoSubmissionsAll(callback) {
        db.query(`SELECT 
                v.filename, v.size, v.uploadAt, v.compressed_status, v.videoUrl,
                a.assignment_id, a.assign_name, a.upload_date, a.due_date,
                u.user_id, u.name
            FROM video v
            LEFT JOIN 
                users u ON v.user_id = u.user_id
            LEFT JOIN 
                assignment a ON a.user_id = u.user_id`,
            
        callback);
    }
}

module.exports = Submission;