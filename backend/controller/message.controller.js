// backend/controller/message.controller.js

const Message = require('../../src/Schema/message.js');

// ===========================
// Envoyer un message
// ===========================
exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, text } = req.body;

  if (!senderId || !receiverId || !text) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const message = new Message({ senderId, receiverId, text });
    await message.save();
    res.status(201).json(message); // retourne le message créé
  } catch (err) {
    console.error('Erreur envoi message :', err);
    res.status(500).json({ error: 'Erreur lors de l’envoi du message' });
  }
};

// ===========================
// Récupérer la conversation entre deux utilisateurs
// ===========================
exports.getConversation = async (req, res) => {
  const { user1Id, user2Id } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id }
      ]
    }).sort({ createdAt: 1 }); // trie par date croissante

    res.status(200).json({ messages });
  } catch (err) {
    console.error('Erreur récupération conversation :', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
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


// Récupérer le nombre de messages non lus pour un utilisateur
exports.getUnreadCount = async (req, res) => {
  const userId = req.params.userId;
  try {
    const count = await Message.countDocuments({ userId, read: false });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getUnreadMessages = async (req, res) => {
  try {
    const messages = await Message.find({ 
      destinataire: req.params.userId,
      lu: false
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
