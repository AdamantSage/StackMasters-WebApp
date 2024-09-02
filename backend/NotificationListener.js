const io = require('socket.io-client');
const socket = io('http://localhost:8000');

// Log that the client is connecting
console.log('Connecting to WebSocket server...');

// Log when the connection is established
socket.on('connect', () => {
    console.log('Connected to WebSocket server');
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

// Optionally, handle errors
socket.on('connect_error', (error) => {
    console.error('Connection Error:', error.message);
});

socket.on('error', (error) => {
    console.error('WebSocket Error:', error.message);
});
