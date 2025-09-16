const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes
const authRoutes = require('./backend/routes/User.Routes'); // pour l'authentification
const utilisateurRoutes = require('./backend/routes/utilisateur.Routes'); // gestion utilisateurs
const eventRoutes = require('./backend/routes/Events.Routes'); // entraînements
const matchRoutes = require('./backend/routes/Match.Routes');
const convocationRoutes = require('./backend/routes/convocations.Routes');
const joueurRoutes = require('./backend/routes/joueurs.Routes');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // autoriser Angular (localhost:4200)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // accès aux images

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/asdam', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// Routes
app.use('/api/asdam', authRoutes);          // routes auth
app.use('/api/users', utilisateurRoutes);   // routes utilisateurs
app.use('/api/events', eventRoutes);        // entraînements
app.use('/api/matches', matchRoutes);       // matchs
app.use('/api/convocations', convocationRoutes); // convocations
app.use('/api/joueurs', joueurRoutes);      // joueurs

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
