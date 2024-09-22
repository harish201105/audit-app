const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middleware/uploadMiddleware');
const fileController = require('../controllers/fileController');

router.post('/upload', uploadMiddleware, fileController.uploadFile);

module.exports = router;
