const Joueur = require('../../src/Schema/user'); // CommonJS


// ✅ Récupérer uniquement les joueurs
exports.getJoueurs = async (req, res) => {
  try {
    const joueurs = await User.find({ role: 'joueur' });
    res.json(joueurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { getJoueurs }; // ✅ CommonJS
