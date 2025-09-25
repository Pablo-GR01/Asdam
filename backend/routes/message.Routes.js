const express = require('express');
const { sendMessage, getConversation, getUserMessages } = require('../controller/message.controller');

const router = express.Router();

// ✅ Route pour envoyer un message
router.post('/', sendMessage);

// ✅ Route pour récupérer une conversation entre deux utilisateurs
router.get('/conversation/:user1Id/:user2Id', getConversation);

// ✅ Route pour récupérer tous les messages d'un utilisateur
router.get('/user/:userId', getUserMessages);

module.exports = router;
