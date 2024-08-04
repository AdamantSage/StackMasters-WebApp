//this is where routes will be hosted
const express = require("express");
const authController = require('../controllers/auth');
const router = express.Router();

//this is a get request
//req is request. res is respond
router.post("/register", authController.register)


module.exports = router;