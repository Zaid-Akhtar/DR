const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { validateImageUpload } = require('../middleware/validation.middleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', verifyToken, upload.single('image'), validateImageUpload, imageController.uploadImage);
router.get('/:imageId', verifyToken, imageController.getImage);

module.exports = router;