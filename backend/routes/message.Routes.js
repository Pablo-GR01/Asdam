const express = require('express');
const router = express.Router();
const messageController = require('../controller/message.controller'); // <-- Ajouter ceci

// Route pour envoyer un message
router.post('/', messageController.sendMessage);

// Récupérer une conversation entre deux utilisateurs
router.get('/conversation/:user1Id/:user2Id', messageController.getConversation);

// Récupérer tous les messages d’un utilisateur
router.get('/user/:userId', messageController.getUserMessages);

// Récupérer les messages non lus d’un utilisateur
router.get('/unread/:userId', messageController.getUnreadMessages);

module.exports = router;


