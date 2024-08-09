const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const upload = require('../config/multerConfig'); // Import the multer configuration


router.post('/controllers', upload.single('file'), videoController.uploadVideo);
router.get('/controllers/:id', videoController.retrieveVideo);


/*
router.post('/controllers', videoController.uploadVideo);
router.get('/videos/:id', videoController.retrieveVideo);*/
//router.post('/videos', videoController.createVideo);
//router.put('/videos/:id', videoController.updateVideo);
//router.delete('/videos/:id', videoController.deleteVideo);

module.exports = router;