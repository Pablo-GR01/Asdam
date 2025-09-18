const express = require('express');
const router = express.Router();
const Match = require('../../src/Schema/Match'); // modèle Mongoose

// POST : créer un match
router.post('/', async (req, res) => {
  try {
    const { equipeA, equipeB, date, lieu, categorie, logoA, logoB } = req.body;

    if (!equipeA || !equipeB || !date || !lieu || !categorie) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const match = new Match({
      equipeA,
      equipeB,
      date: new Date(date),
      lieu,
      categorie,
      logoA: logoA || 'assets/ASDAM.png', // si non fourni, logo par défaut ASDAM
      logoB: logoB || ''
    });

    const savedMatch = await match.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    console.error('Erreur création match:', err);
    res.status(500).json({ message: err.message });
  }
});
// GET : récupérer tous les matchs
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
