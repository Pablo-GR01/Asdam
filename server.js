const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Routes existantes
const authRoutes = require('./backend/routes/User.Routes');
const userRoutes = require('./backend/routes/User.Routes');
const eventRoutes = require('./backend/routes/Events.Routes'); // ✅ ajouté

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/asdam', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// Routes
app.use('/api/asdam', authRoutes);
app.use('/api', userRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes); // ✅ nouvelle route pour les entraînements

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
