const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const equipesEnum = [
  'U6','U7','U8','U9','U10','U11','U12','U13','U14','U15','U16','U17','U18',
  'SeniorA','SeniorB','U23','SeniorC','SeniorD'
];

const utilisateurSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['joueur', 'coach', 'inviter'], default: 'joueur' },
  codeCoach: { type: String }, // optionnel pour coach
  equipe: { type: String, enum: equipesEnum }, // joueur ou coach peuvent choisir leur équipe
  initiale: { type: String },
  cguValide: { type: Boolean, default: true },
  membreDepuis: { type: Date, default: Date.now } // <-- stocke date + heure automatiquement
});

// Génération des initiales
utilisateurSchema.pre('save', function (next) {
  if (this.nom && this.prenom) {
    this.initiale = (this.prenom[0] + this.nom[0]).toUpperCase();
  }
  next();
});

// Hash du mot de passe
utilisateurSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Vérification du mot de passe
utilisateurSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', utilisateurSchema);
