const io = require('socket.io-client');
const socket = io('http://localhost:8000');

// Log that the client is connecting
console.log('Connecting to WebSocket server...');

// Log when the connection is established
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
});

//listener for the videoUploadSuccess event.
socket.on('videoUploadSuccess', (data) => {
    console.log('Video upload success:', data);
});

//listener for the videoRetrieveSuccess event.
socket.on('videoRetrieveSuccess', (data) => {
    console.log('Video retrieve success:', data);
});

// Log when the connection is disconnected
socket.on('disconnect', () => {
    console.log('Disconnected from WebSocket server');
});

// Listen for specific events and log their data
socket.on('user_created', (data) => {
    console.log('User Created:', data);
});

socket.on('user_logged_in', (data) => {
    console.log('User Logged In:', data);
});

socket.on('user_updated', (data) => {
    console.log('User Updated:', data);
});

socket.on('user_deleted', (data) => {
    console.log('User Deleted:', data);
});

// Listen for video compression success
socket.on('videoCompressionSuccess', (data) => {
    console.log('Video compression successful:', data);
});


// Trigger video compression
function compressVideo(videoData) {
    socket.emit('compressVideo', videoData);
}

// Trigger video download submission
function submitVideoDownload(videoId) {
    console.log(`Requesting download for video with ID: ${videoId}`);
    // Emit the 'submitVideoDownload' event with the provided videoId
    socket.emit('submitVideoDownload', videoId);
}

// Optionally, handle errors
socket.on('connect_error', (error) => {
    console.error('Connection Error:', error.message);
});

socket.on('error', (error) => {
    console.error('WebSocket Error:', error.message);
});






