const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const adminMiddleware = require('../middleware/admin.middleware');
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');

// const { verifyToken } = require('../middleware/admin.middleware');
// const { verifyAdmin } = require('../middleware/auth.middleware');
// const verifyAdmin = require('../middleware/admin.middleware');
router.use(adminMiddleware);
router.get('/stats', verifyToken, verifyAdmin, adminController.getStats);
router.get('/users', verifyToken, verifyAdmin, adminController.getAllUsers);
router.get('/reports', verifyToken, verifyAdmin, adminController.getAllReports);

module.exports = router;
