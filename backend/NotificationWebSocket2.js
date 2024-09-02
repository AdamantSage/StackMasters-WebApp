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
