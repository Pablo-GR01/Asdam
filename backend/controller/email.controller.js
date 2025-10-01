const nodemailer = require('nodemailer');
require('dotenv').config();

// Création du transporteur Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction générique pour envoyer un email (retourne une promesse)
async function sendMail({ to, subject, text }) {
  if (!to || !subject || !text) {
    throw new Error('Champs manquants pour l’email');
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text
  };

  return transporter.sendMail(mailOptions);
}

// ✅ Pour Express : export d’une fonction middleware
exports.sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  try {
    const info = await sendMail({ to, subject, text });
    console.log('Email envoyé ✅', info);
    res.status(200).json({ message: 'Email envoyé', info });
  } catch (err) {
    console.error('Erreur envoi mail ❌', err);
    res.status(500).json({ message: 'Erreur envoi mail', error: err.message || err });
  }
};

// 🔹 Optionnel : test direct depuis Node.js
if (require.main === module) {
  sendMail({
    to: 'destinataire@example.com',
    subject: 'Test Nodemailer',
    text: 'Ceci est un test'
  })
    .then(info => console.log('Email envoyé ✅', info))
    .catch(err => console.error('Erreur envoi mail ❌', err));
}
