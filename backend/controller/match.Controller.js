// matchController.js
const Match = require('../../src/Schema/Match');
const Convocation = require('../../src/Schema/convocation');
const Utilisateur = require('../../src/Schema/Utilisateur'); // ton schema utilisateur

// Création d'un match
exports.creerMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json({ message: 'Match créé avec succès', match });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la création du match', error: err });
  }
};

// Création d'une convocation
exports.creerConvocation = async (req, res) => {
  try {
    const convocation = new Convocation(req.body);
    await convocation.save();
    res.status(201).json({ message: 'Convocation créée avec succès', convocation });
  } catch (err) {
    res.status(400).json({ message: 'Erreur lors de la création de la convocation', error: err });
  }
};

// Récupérer tous les utilisateurs avec rôle "joueur"
exports.getJoueurs = async (req, res) => {
  try {
    const joueurs = await Utilisateur.find({ role: 'joueur' });
    res.status(200).json(joueurs);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des joueurs', error: err });
  }
};
