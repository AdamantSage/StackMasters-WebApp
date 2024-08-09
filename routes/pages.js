//this is where routes will be hosted
const express = require("express");
const router = express.Router();
const checkRole = require('../middleware/role');



// Middleware for role-based content within the dashboard route
router.post('/login', checkRole(['admin', 'lecturer', 'student']), (req, res) => {
    const userRole = req.user.role; // Assuming req.user is populated by your authentication middleware

    if (userRole === 'admin') {
        res.render('index', {message: "you are in admin dashboard"}); // Render Admin dashboard view
    } else if (userRole === 'lecturer') {
        res.render('index', {message: "you are in lecturer dashboard"});  // Render Lecturer dashboard view
    } else if (userRole === 'student') {
        res.render('index', {message: "you are in student dashboard"});  // Render Student dashboard view
    } else {
        res.status(403).send('Access denied');
    }
});


//this is a get request
//req is request. res is respond
router.get("/", (req, res) => {
    
    res.render("index");
});

//this will render this page so that we can find it on the web/localhost
router.get("/register", (req, res) => {
    res.render("register");
});


//login page
router.get("/login", (req, res) => {
    res.render("login");
});

module.exports = router;