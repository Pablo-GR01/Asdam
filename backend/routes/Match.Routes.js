const express = require('express');
const router = express.Router();
const Match = require('../../src/Schema/Match'); // ton modèle Mongoose

// POST : créer un match
router.post('/', async (req, res) => {
  try {
    const { equipeA, equipeB, date, lieu } = req.body;

    if (!equipeA || !equipeB || !date || !lieu) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Création du match
    const match = new Match({
      equipeA,
      equipeB,
      date: new Date(date), // conversion date
      lieu
    });

    const savedMatch = await match.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    console.error(err);
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
