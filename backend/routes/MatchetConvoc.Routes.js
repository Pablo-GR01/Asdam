// matchRoutes.js
const express = require('express');
const router = express.Router();
const matchController = require('../controller/match.Controller');

// Routes
router.post('/match', matchController.creerMatch);
router.post('/convocation', matchController.creerConvocation);

// Récupérer tous les joueurs
router.get('/utilisateurs', matchController.getJoueurs);

module.exports = router;
