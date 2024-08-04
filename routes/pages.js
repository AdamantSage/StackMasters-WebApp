//this is where routes will be hosted
const express = require("express");

const router = express.Router();

//this is a get request
//req is request. res is respond
router.get("/", (req, res) => {
    
    res.render("index");
});

//this will render this page so that we can find it on the web/localhost
router.get("/register", (req, res) => {
    res.render("register");
});

module.exports = router;