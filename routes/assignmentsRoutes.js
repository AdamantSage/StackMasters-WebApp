const router = express.Router();
const express = require("express");

const{
    createAssignment,
    getAssignment,
    updateAssignment,
    deleteAssignment
} = require('./controllers/assignmentController');

router.post('/', createAssignment);
router.get('/', getAssignment);
router.put('/', updateAssignment);
router.delete('/', deleteAssignment);

module.exports = router;