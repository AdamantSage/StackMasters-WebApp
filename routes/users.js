// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');
const authenticateToken = require('../middleware/auth');

// Create a new user
router.post('/create', usersController.create);

// Read all users
router.get('/users', usersController.read);

// Update a user
router.put('/update/:id', usersController.update);

// Delete a user
router.delete('/delete/:id', usersController.delete);

//logging in
router.post('/login', usersController.login);

// Example protected route
router.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

module.exports = router;
