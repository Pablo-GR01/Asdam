const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  equipeA: { type: String, required: true },
  equipeB: { type: String, required: true },
  date: { type: Date, required: true },
  lieu: { type: String, required: true },
  categorie: { type: String, required: true }, // ✅ nouveau champ
  scoreA: { type: Number, default: 0 },
  scoreB: { type: Number, default: 0 }
});

module.exports = mongoose.model('Match', matchSchema);
