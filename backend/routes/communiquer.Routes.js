const express = require('express');
const router = express.Router();
const { getCommuniques, addCommunique, likeCommunique, uploadImage } = require('../controller/communique.controller');

// --- Routes communiqués ---
router.get('/', getCommuniques);
router.post('/', uploadImage, addCommunique); // Middleware Multer pour upload
router.post('/like/:id', likeCommunique);
router.post('/commun/dislike/:id', communiqueController.dislikeCommunique);


module.exports = router;
