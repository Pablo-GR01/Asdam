// backend/controller/message.controller.js

const Message = require('../../src/Schema/message.js');

// ===========================
// Envoyer un message
// ===========================
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, text, senderName } = req.body;

    if (!senderId || !receiverId || !text) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    // 1️⃣ Enregistrer le message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      senderName,
      timestamp: new Date()
    });

    // 2️⃣ Envoyer un mail si l'utilisateur a un email
    const receiver = await User.findById(receiverId);
    if (receiver?.email) {
      const subject = `Nouveau message de ${senderName}`;
      const emailText = `
Bonjour ${receiver.firstName},

Vous avez reçu un nouveau message sur l'application :

"${text}"

Connectez-vous pour y répondre.
      `;

      sendMail({ to: receiver.email, subject, text: emailText })
        .then(info => console.log('✅ Email envoyé', info))
        .catch(err => console.error('❌ Erreur envoi mail', err));
    }

    res.status(200).json(newMessage);

  } catch (err) {
    console.error('Erreur envoi message', err);
    res.status(500).json({ message: 'Erreur envoi message', error: err.message });
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
