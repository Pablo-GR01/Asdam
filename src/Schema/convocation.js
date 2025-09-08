// Création Schema Convocation

const mongoose = require('mongoose');

// Exemple d'énumération des équipes et catégories
const equipesEnum = ["ASDAM"];
const categoriesEnum = ['U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18',
'SeniorA','SeniorB','U23','SeniorC','SeniorD']

const ConvocationSchema = new mongoose.Schema({
  equipe: { type: String, enum: equipesEnum, required: true }, // Équipe concernée
  categorie: { type: String, enum: categoriesEnum, required: true }, // Catégorie de l'équipe

  matchNom: { type: String, required: true }, // Nom du match ou référence

  joueurs: [{ type: String, required: true }], // Liste des joueurs convoqués

  date: { type: Date, required: true }, // Date de la convocation

  description: { type: String, default: "" } // Infos complémentaires
});

module.exports = mongoose.model('Convocation', ConvocationSchema);
