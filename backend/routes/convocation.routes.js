const express = require('express');
const router = express.Router();
const Convocation = require('../../src/Schema/Convocation'); // ton modèle Mongoose

// POST : créer une convocation
router.post('/', async (req, res) => {
  try {
    const { match, joueurs, date, lieu } = req.body;

    if (!match || !joueurs || !date || !lieu) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const convocation = new Convocation({
      match,
      joueurs,
      date: new Date(date),
      lieu
    });

    const savedConvocation = await convocation.save();
    res.status(201).json(savedConvocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

// GET : récupérer toutes les convocations
router.get('/', async (req, res) => {
  try {
    const convocations = await Convocation.find();
    res.json(convocations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
