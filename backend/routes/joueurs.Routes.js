// backend/routes/joueurs.Routes.ts
import { Router } from 'express';
import { Joueur } from '../../src/Schema/Joueur';

const router = Router();

// GET /api/joueurs - récupérer uniquement les joueurs
router.get('/', async (req, res) => {
  try {
    const joueurs = await Joueur.find({ role: 'joueur' }); // filtre par role
    res.json(joueurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/joueurs/:id - mettre à jour statut
router.put('/:id', async (req, res) => {
  const { statut, date } = req.body;
  try {
    const joueur = await Joueur.findByIdAndUpdate(
      req.params.id,
      { statut, date },
      { new: true }
    );
    res.json(joueur);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
