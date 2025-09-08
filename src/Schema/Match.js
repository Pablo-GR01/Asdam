// Création Schema Match

const mongoose = require('mongoose');

// Exemple d'énumération des équipes (à adapter selon ton JSON d'équipes)
const equipesEnum = ["ASDAM", "PSG", "OM", "FCB"];

const MatchSchema = new mongoose.Schema({
  nom: { type: String, required: true }, // Nom du match (ex: "ASDAM vs PSG")

  score: {
    type: String,
    default: null // tu peux aussi mettre un objet { equipe1: Number, equipe2: Number }
  },

  equipe: { type: String, enum: equipesEnum, required: true }, // L'équipe qui joue

  date: { type: Date, required: true } // Date du match
});

module.exports = mongoose.model('Match', MatchSchema);
