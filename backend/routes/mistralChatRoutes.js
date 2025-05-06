const express = require('express');
const { handleMistralChat, fetchMistralModels } = require('../controllers/mistralChatHandler');

const router = express.Router();

router.post('/chat', handleMistralChat);
router.get('/models', fetchMistralModels);

module.exports = router;
