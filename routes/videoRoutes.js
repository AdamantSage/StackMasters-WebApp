const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/controllers', videoController.uploadVideo);
//router.get('/videos/:id', videoController.getVideoById);
//router.post('/videos', videoController.createVideo);
//router.put('/videos/:id', videoController.updateVideo);
//router.delete('/videos/:id', videoController.deleteVideo);

module.exports = router;