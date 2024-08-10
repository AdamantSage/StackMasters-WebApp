const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../config/multerConfig'); // Import Multer configuration

router.post('/upload', upload.single('video'), videoController.uploadVideo);
router.get('/videos/:id', videoController.retrieveVideo);

module.exports = router;
