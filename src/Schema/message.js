import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  expediteurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  destinataireId: { type: mongoose.Schema.Types.ObjectId, ref: 'Utilisateur', required: true },
  texte: { type: String, required: true },
  dateCreation: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
