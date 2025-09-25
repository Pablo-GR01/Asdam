const express = require('express');
const { sendMessage, getConversation, getUserMessages } = require('../controller/message.controller');

const router = express.Router();

router.post('/messages', sendMessage);
router.get('/conversation/:user1Id/:user2Id', getConversation);
router.get('/user/:userId', getUserMessages);



module.exports = router;
