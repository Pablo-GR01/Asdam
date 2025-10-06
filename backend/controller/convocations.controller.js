require('dotenv').config();
const Convocation = require('../../src/Schema/convocations');
const User = require('../../src/Schema/user');
const nodemailer = require('nodemailer');

// ===== Service Mailer =====
async function sendMail({ to, subject, plainText, html }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });

  return transporter.sendMail({
    from: `"TeamAsdam" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text: plainText,
    html
  });
}

// ===========================
// Créer une convocation
// ===========================
async function creerConvocation(req, res) {
  try {
    const { match, date, joueurs, lieu, equipe } = req.body;

    if (!match || !date || !joueurs || !Array.isArray(joueurs)) {
      return res.status(400).json({ message: 'Champs manquants ou invalides' });
    }

    const convocation = new Convocation({ match, date, joueurs, lieu, equipe });
    await convocation.save();

    // Envoyer un email à tous les joueurs
    for (const joueur of joueurs) {
      const user = await User.findById(joueur._id);
      if (user?.email) {
        const subject = `Nouvelle convocation : ${match}`;
        const appUrl = process.env.NODE_ENV === 'production'
          ? 'https://teamasdam.app/login'
          : 'http://localhost:4200/connexion';

        const emailHtml = `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <p>Bonjour ${user.nom || ''},</p>
            <p>Vous avez été convoqué pour : <strong>${match}</strong> le ${new Date(date).toLocaleString()}.</p>
            <p>
              <a href="${appUrl}" target="_blank"
                style="display: inline-block;
                       padding: 12px 24px;
                       background-color: #ca0303;
                       color: #ffffff !important;
                       text-decoration: none;
                       border-radius: 6px;
                       font-weight: bold;
                       font-size: 14px;
                       text-align: center;">
                Voir la convocation
              </a>
            </p>
            <p>Bonne journée,<br/>L'équipe TeamAsdam</p>
          </div>
        `;

        try {
          await sendMail({ to: user.email, subject, plainText: match, html: emailHtml });
          console.log(`✅ Email envoyé à ${user.email}`);
        } catch (err) {
          console.error('❌ Erreur envoi mail', err);
        }
      }
    }

    res.status(201).json(convocation);
  } catch (err) {
    console.error('Erreur création convocation', err);
    res.status(500).json({ message: 'Erreur création convocation', error: err.message });
  }
}

// ===========================
// Récupérer toutes les convocations
// ===========================
async function getAllConvocations(req, res) {
  try {
    const convocations = await Convocation.find()
      .populate('joueurs._id', 'nom prenom equipe role')
      .sort({ date: -1 });
    res.json(convocations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des convocations' });
  }
}

// ===========================
// Récupérer une convocation par ID
// ===========================
async function getConvocationById(req, res) {
  try {
    const convocation = await Convocation.findById(req.params.id)
      .populate('joueurs._id', 'nom prenom equipe role');
    if (!convocation) return res.status(404).json({ message: 'Convocation non trouvée' });
    res.json(convocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération de la convocation' });
  }
}

// ===========================
// Supprimer une convocation
// ===========================
async function deleteConvocation(req, res) {
  try {
    const convocation = await Convocation.findByIdAndDelete(req.params.id);
    if (!convocation) return res.status(404).json({ message: 'Convocation non trouvée' });
    res.json({ message: 'Convocation supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
}

// ===========================
// Compter les convocations d’un joueur
// ===========================
async function getConvocationCount(req, res) {
  try {
    const { joueurId } = req.params;
    const count = await Convocation.countDocuments({ 'joueurs._id': joueurId });
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  creerConvocation,
  getAllConvocations,
  getConvocationById,
  deleteConvocation,
  getConvocationCount
};
