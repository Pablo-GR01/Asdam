require('dotenv').config();
const nodemailer = require('nodemailer');
const User = require('../../src/Schema/user');
const Convocation = require('../../src/Schema/convocations');

// Fonction pour envoyer mail
async function sendMail({ to, subject, plainText, html }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  return transporter.sendMail({ from: `"TeamAsdam" <${process.env.MAIL_USER}>`, to, subject, text: plainText, html });
}

// Route pour confirmer présence
async function confirmerPresence(req, res) {
  try {
    const { id, status } = req.query; // id du joueur
    if (!id || !status) return res.status(400).send('Paramètres manquants');

    const user = await User.findById(id);
    if (!user) return res.status(404).send('Joueur non trouvé');

    // Exemple : récupérer le coach
    const coachEmail = process.env.COACH_EMAIL; // Définir dans .env

    // Contenu du mail au coach
    const subject = `Réponse à la convocation : ${user.prenom} ${user.nom}`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Bonjour,</p>
        <p>Le joueur <strong>${user.prenom} ${user.nom}</strong> a répondu à sa convocation :</p>
        <p><strong>Status :</strong> ${status === 'present' ? '✅ Présent' : '❌ Absent'}</p>
      </div>
    `;

    await sendMail({ to: coachEmail, subject, plainText: `Le joueur ${user.prenom} ${user.nom} a répondu : ${status}`, html });

    res.send(`<h2>Merci ! Votre réponse a été envoyée au coach.</h2>`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur lors de l’envoi de la réponse');
  }
}

module.exports = { confirmerPresence };
