const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

router.get('/api/requests', requestController.getAllRequests);

module.exports = router;