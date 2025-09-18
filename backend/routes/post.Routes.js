const express = require('express');
const router = express.Router();
const postController = require('../controller/post.controller');
const multer = require('multer');
const path = require('path');
const Post = require('../../src/Schema/post');

// 🔹 Configuration multer pour uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ✅ Maintenant tu peux utiliser "upload"
router.post('/media', upload.single('media'), postController.createPostWithMedia);

// Routes principales
router.get('/', postController.getPosts);
router.post('/', upload.single('media'), postController.createPost);
router.post('/:id/like', postController.likePost);

// 🔹 Ajout commentaire
router.post('/:id/comment', async (req, res) => {
  try {
    const postId = req.params.id;
    const { user, text, initials } = req.body;

    if (!user || !text || !initials) {
      return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });

    post.comments.push({ user, text, initials, time: new Date() });
    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.error("Erreur ajout commentaire:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

router.delete('/:id', postController.deletePost);

module.exports = router;
