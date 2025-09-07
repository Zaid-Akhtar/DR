const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/:reportId', verifyToken, reportController.getReport);
router.get('/user/reports', verifyToken, reportController.getUserReports);
router.get('/:reportId/pdf', verifyToken, reportController.generatePDF);

module.exports = router;