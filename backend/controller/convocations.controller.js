const Convocation = require('../../src/Schema/convocations');

// Créer une convocation
exports.creerConvocation = async (req, res) => {
  try {
    const convocation = new Convocation(req.body);
    await convocation.save();
    res.status(201).json(convocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la création de la convocation' });
  }
};

// Récupérer toutes les convocations
exports.getAllConvocations = async (req, res) => {
  try {
    const convocations = await Convocation.find().populate('joueurs._id', 'nom prenom equipe role');
    res.json(convocations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération des convocations' });
  }
};

// Récupérer une convocation par ID
exports.getConvocationById = async (req, res) => {
  try {
    const convocation = await Convocation.findById(req.params.id).populate('joueurs._id', 'nom prenom equipe role');
    if (!convocation) return res.status(404).json({ message: 'Convocation non trouvée' });
    res.json(convocation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la récupération de la convocation' });
  }
};

// Supprimer une convocation
exports.deleteConvocation = async (req, res) => {
  try {
    const convocation = await Convocation.findByIdAndDelete(req.params.id);
    if (!convocation) return res.status(404).json({ message: 'Convocation non trouvée' });
    res.json({ message: 'Convocation supprimée' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};
