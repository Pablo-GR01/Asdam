const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  day: { type: String, required: true },
  hour: { type: String, required: true },       // heure de début
  endHour: { type: String, required: true },    // heure de fin
  title: { type: String, required: true },
  coach: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },      // U6, U7, …, SeniorD
  duration: { type: Number },                   // optionnel si calculé depuis hour → endHour
  color: { type: String },                      // optionnel
  imageUrl: { type: String }                    // optionnel
});

// Nom du modèle : "Event" → collection "events"
module.exports = mongoose.model('Event', eventSchema);
