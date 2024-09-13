const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
//const upload = require('../multerConfig'); // Import the multer configuration
const upload  = require('../config/multerConfig');


router.post('/controllers', upload.single('file'), videoController.uploadVideo, videoController.multerErrorHandler);
router.get('/controllers/:id', videoController.retrieveVideo);

router.get('/stream/:id', videoController.streamVideo);

module.exports = router;