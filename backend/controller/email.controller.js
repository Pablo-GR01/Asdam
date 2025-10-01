const nodemailer = require('nodemailer');

// Config transporteur SMTP (ici exemple Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // ton adresse Gmail
    pass: process.env.EMAIL_PASS  // ton mot de passe ou App Password
  }
});

exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, text } = req.body;

    if (!to || !subject || !text) {
      return res.status(400).json({ message: 'Champs manquants' });
    }

    await transporter.sendMail({
      from: `"ASDAM App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });

    res.json({ message: '✅ Email envoyé avec succès' });
  } catch (err) {
    console.error("❌ Erreur envoi email :", err);
    res.status(500).json({ message: 'Erreur lors de l’envoi de l’email' });
  }
};
