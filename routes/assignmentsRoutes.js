import { Router } from "express";

const express = require("express");

const{
    createAssignment,
    getAssignment,
    updateAssignment,
    deleteAssignment
} = require('./controllers/assignmentController');

const router = express.Router();

router.post('/', createAssignment);
router.get('/', getAssignment);
router.put('/', updateAssignment);
router.delete('/', deleteAssignment);

module.exports = router;