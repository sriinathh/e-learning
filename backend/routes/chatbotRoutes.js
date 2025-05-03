const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Route for processing chatbot messages
router.post('/message', chatbotController.processMessage);

module.exports = router; 