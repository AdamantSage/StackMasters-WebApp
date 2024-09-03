const Assignment = require('./models/assignment');
//const User = require('../controllers/user');
const http = require('http');
const socketIo = require('socket.io');

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.IO server running');
});

const io = socketIo(server);

// Set up Socket.IO
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Function to emit notifications
const emitNotification = (event, data) => {
    io.emit(event, data);
};

// Export the function to emit notifications
module.exports = { io, emitNotification };

// Start the server
server.listen(8000, () => console.log("listening on http://localhost:8000"));
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('user connected');

        socket.on('joinRoom', (roomName, role) =>{
            if(role == 'admin'){
                socket.join('adminRoom');
            }else if(role == 'lecturer'){
                socket.join('lectureRoom');
            }else if(role =='student'){
                socket.join('studentRoom');
            }else{
                socket.join(roomName);
            }
        });

        socket.on('createAssignment', (assignmentData) => {
            Assignment.create(assignmentData, (err, results) => {
                if (err) {
                    console.log('Error saving assignment to database:', err);
                    io.to('adminRoom').emit('Error', 'Failed to save assignment');
                    return;
                }else{
                    console.log('Assignment created', results);
                    // Emit the newAssignment event only if the assignment was saved successfully
                    io.to('adminRoom').emit('New Assignment', assignmentData);
                    io.to('lectureRoom').emit('New Assignment', assignmentData);
                    return;
                }
            });
        });

        socket.on('getAssignment', (assignmentID) => {
            Assignment.select(assignmentID, (err, results) => {
                if(err){
                    console.log('Error finding assignment in database', err);
                    io.emit('Error', 'Faild to find assignment');
                    return;
                }else{
                    console.log('Assignment found', results);
                    io.emit('Assignment found', results[0]);
                    return;
                }
            });
        });

        socket.on('updateAssignment', (assignmentData) =>{
            Assignment.update(assignmentData, (err, results) => {
                if(err){
                    console.log('Error updating assignment in database', err);
                    io.emit('Error', 'Failed to update assignment');
                    return;
                }else{
                    console.log('Assignment updated', results);
                    io.emit('Assignment updated', assignmentData);
                    return;
                }
            })
        });

        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });
}