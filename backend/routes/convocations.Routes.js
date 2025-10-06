const express = require('express');
const router = express.Router();
const convocationController = require('../controller/convocations.controller');
const Convocation = require('../../src/Schema/convocations');

// Créer une convocation
router.post('/', convocationController.creerConvocation);

// Récupérer toutes les convocations
router.get('/', convocationController.getAllConvocations);

// Récupérer une convocation par ID
router.get('/:id', convocationController.getConvocationById);

// Supprimer une convocation
router.delete('/:id', convocationController.deleteConvocation);

// Compter les convocations d’un joueur
router.get('/count/:joueurId', convocationController.getConvocationCount);

module.exports = router;
