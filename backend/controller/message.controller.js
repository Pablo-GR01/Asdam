// backend/controller/message.controller.js

const Message = require('../../src/Schema/message.js');

// ===========================
// Envoyer un message
// ===========================
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  if (!senderId || !receiverId || !text) {
    return res.status(400).json({ message: 'Champs manquants' });
  }

  try {
    const message = await Message.create({
      senderId,
      receiverId,
      text,
      dateCreation: new Date()
    });

    return res.status(201).json(message);
  } catch (err) {
    console.error('Erreur sendMessage:', err);
    return res.status(500).json({ message: err.message });
  }
};

// ===========================
// Récupérer la conversation entre deux utilisateurs
// ===========================
exports.getConversation = async (req, res) => {
  try {
    const { user1Id, user2Id } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    }).sort({ dateCreation: 1 });

    return res.status(200).json(messages);
  } catch (err) {
    console.error('Erreur getConversation:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// ===========================
// Récupérer tous les messages d’un utilisateur
// ===========================
exports.getUserMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ dateCreation: -1 });

    return res.status(200).json(messages);
  } catch (err) {
    console.error('Erreur getUserMessages:', err);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};
