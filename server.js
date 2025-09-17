const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Routes
const authRoutes = require('./backend/routes/User.Routes');
const utilisateurRoutes = require('./backend/routes/utilisateur.Routes');
const eventRoutes = require('./backend/routes/Events.Routes');
const matchRoutes = require('./backend/routes/Match.Routes');
const convocationRoutes = require('./backend/routes/convocations.Routes');
const postRoutes = require("./backend/routes/post.Routes");

// Pour upload média
const multer = require('multer');
const postController = require('./backend/controller/post.controller'); // <-- ajout

const app = express();
const PORT = 3000;

// 🔹 Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(uploadDir));

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/asdam', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connexion à MongoDB réussie'))
.catch(err => console.error('❌ Erreur MongoDB :', err));

// Routes
app.use('/api/asdam', authRoutes);
app.use('/api/users', utilisateurRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/convocations', convocationRoutes);
app.use("/api/posts", postRoutes);

// Route POST pour créer un post avec média
app.post('/api/posts/media', upload.single('media'), postController.createPostWithMedia);

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur backend démarré sur http://localhost:${PORT}`);
});
