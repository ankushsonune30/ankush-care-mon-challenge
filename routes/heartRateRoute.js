const express = require('express');
const router = express.Router();
const heartRateController = require('../controllers/heartRateController');

// POST endpoint to process heart rate data
router.post('/process', heartRateController.handleHeartRateRequest);

module.exports = router;
