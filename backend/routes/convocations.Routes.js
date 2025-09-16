const express = require('express');
const router = express.Router();
const convocationController = require('../controller/convocations.controller');

router.post('/', convocationController.creerConvocation);
router.get('/', convocationController.getAllConvocations);
router.get('/:id', convocationController.getConvocationById);
router.delete('/:id', convocationController.deleteConvocation);


// GET /api/convocations/:joueurId
router.get('/:joueurId', async (req, res) => {
    try {
      const convocations = await Convocation.find({ joueur: req.params.joueurId });
      res.json(convocations);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});

module.exports = router;
