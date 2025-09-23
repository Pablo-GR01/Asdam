const express = require('express');
const router = express.Router();
const User = require('../../src/Schema/user'); // Assure-toi que le chemin est correct
const userController = require('../controller/user.controller');
const authController = require('../controller/auth.controller');
const authMiddleware = require('../../backend/middleware/auth'); // renomme correctement

// ================= ROUTES UTILISATEURS =================

// ✅ Créer un utilisateur
router.post('/', userController.registerUser);

// ✅ Connexion
router.post('/login', authController.login);

router.get('/me', authController.authenticate, authController.getCurrentUser);

// ✅ Récupérer un utilisateur par email
router.get('/users/:email', userController.getUserByEmail);

// ✅ Supprimer un utilisateur par ID
router.delete('/users/:id', userController.deleteUserById);

// ✅ Modifier un utilisateur par ID (+ mise à jour du nomProf si prof)
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    let user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    // Si c’est un prof, on met à jour nomProf automatiquement
    if (user.role === 'prof' && (updates.nom || updates.prenom)) {
      const nouveauNom = updates.nom || user.nom;
      const nouveauPrenom = updates.prenom || user.prenom;
      updates.nomProf = `${nouveauPrenom} ${nouveauNom}`;
    }

    user = await User.findByIdAndUpdate(id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Récupérer tous les utilisateurs
router.get('/asdam/users', userController.getAllUsers);


// ✅ Modifier uniquement le mot de passe d’un utilisateur
router.put('/users/:id/password', userController.changePassword);

// ✅ Récupérer l’utilisateur connecté (depuis JWT)
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// ✅ Récupérer la carte complète de l’utilisateur par ID
router.get('/card/:id', authMiddleware, userController.getUserCard);

module.exports = router;
