// src/routes/messageRoutes.js
const express = require('express');
const { sendMessage, getConversation, getUserMessages } = require('../controllers/messageController');

const router = express.Router();

router.post('/send', sendMessage);
router.get('/conversation/:user1Id/:user2Id', getConversation);
router.get('/user/:userId', getUserMessages);

module.exports = router;
