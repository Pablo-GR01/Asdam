const Joueur = require('../../src/Schema/user'); // CommonJS

// 🔹 Récupérer tous les joueurs
const getJoueurs = async (req, res) => {
  try {
    const joueurs = await Joueur.find();
    res.status(200).json(joueurs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

module.exports = { getJoueurs }; // ✅ CommonJS
