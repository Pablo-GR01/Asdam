const express = require('express');
const multer = require('multer');
const path = require('path');
const Event = require('../schema/event');

const router = express.Router();

// 📂 Config multer pour upload image
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ➕ Ajouter un événement
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { title, coach, category, day, hour } = req.body;

    const newEvent = new Event({
      title,
      coach,
      category,
      day,
      hour,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: 'Erreur ajout événement', error: err });
  }
});

// 📋 Récupérer tous les événements
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération', error: err });
  }
});

// ❌ Supprimer un événement
router.delete('/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Événement supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression', error: err });
  }
});

module.exports = router;
