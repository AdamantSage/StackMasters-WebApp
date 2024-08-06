const connection = require('../config/mysqlConfig');

// Function to add a new video record
const addVideo = (filename, path, mimetype, size, callback) => {
    const query = `
        INSERT INTO videos (filename, path, mimetype, size)
        VALUES (?, ?, ?, ?)
    `;
    connection.query(query, [filename, path, mimetype, size], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

module.exports = { addVideo };