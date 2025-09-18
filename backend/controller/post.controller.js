const Post = require('../../src/Schema/post');
const path = require('path');
const fs = require('fs');

// 🔹 Créer un post avec média
exports.createPostWithMedia = async (req, res) => {
  try {
    const { content, user, initials } = req.body;

    if (!initials) {
      return res.status(400).json({ message: 'Initials is required' });
    }

    // Vérifier la présence du fichier uploadé
    const media = req.file ? req.file.filename : null;

    // Vérification durée vidéo (moins de 15s)
    if (req.file && req.file.mimetype.startsWith('video/')) {
      // Ici tu peux brancher ffmpeg pour analyser la durée
      // ou bloquer directement si nécessaire
    }

    const newPost = new Post({
      content,
      user,
      initials, // ✅ requis par le schéma
      media,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      shares: 0
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Erreur création post avec média:', err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

// 🔹 Créer un post simple
exports.createPost = async (req, res) => {
  try {
    const { content, user, initials } = req.body; // ✅ ajouter initials
    const media = req.file ? req.file.filename : undefined;

    const newPost = new Post({
      content,
      user,
      initials, // ✅ stocker les initiales
      media,
      likes: 0,
      isLiked: false,
      isBookmarked: false,
      comments: [],
      shares: 0
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur création post', error: err });
  }
};

// 🔹 Récupérer tous les posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération posts', error: err });
  }
};

// 🔹 Liker / unliker
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur like post', error: err });
  }
};

// 🔹 Ajouter un commentaire
exports.addComment = async (req, res) => {
  try {
    console.log('Body reçu:', req.body); // debug
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    post.comments.push({
      user: req.body.user,
      initials: req.body.initials,
      text: req.body.text,
      time: req.body.time || new Date().toLocaleString()
    });

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    console.error('Erreur ajout commentaire:', err);
    res.status(500).json({ message: 'Erreur ajout commentaire', error: err.message });
  }
};


// 🔹 Supprimer un post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    if (post.media) {
      const filePath = path.join(__dirname, '../uploads/', post.media);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await post.deleteOne();
    res.json({ message: 'Post supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression post', error: err });
  }
};

// 🔹 Modifier un post (avec ou sans média)
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    // Mise à jour du contenu
    if (req.body.content) post.content = req.body.content;

    // Gestion du média
    if (req.file) {
      // Supprimer l'ancien média si existant
      if (post.media) {
        const oldPath = path.join(__dirname, '../uploads/', post.media);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      post.media = req.file.filename;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur modification post', error: err });
  }
};
