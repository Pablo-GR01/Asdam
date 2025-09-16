import mongoose from 'mongoose';

// Schéma pour les messages
const messageSchema = new mongoose.Schema({
  expediteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true }, // ID de l'expéditeur
  destinataireId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true }, // ID du destinataire
  texte: { type: String, required: true }, // contenu du message
  dateCreation: { type: Date, default: Date.now } // date d'envoi
});

// Modèle Mongoose pour les messages
export const Message = mongoose.model('Message', messageSchema);
