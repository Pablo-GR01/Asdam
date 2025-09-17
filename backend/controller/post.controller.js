const Post = require('../../src/Schema/post');
const path = require('path');
const fs = require('fs');


exports.createPostWithMedia = async (req, res) => {
  try {
    const { content, user } = req.body;
    const media = req.file ? req.file.filename : undefined;

    const newPost = new Post({
      content,
      user,
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
    res.status(500).json({ message: 'Erreur lors de la création du post avec média' });
  }
};


// 🔹 Créer un post
exports.createPost = async (req, res) => {
  try {
    let media = null;
    if (req.file) media = req.file.filename;

    const newPost = new Post({
      content: req.body.content,
      user: req.body.user,
      media,
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
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post non trouvé' });

    post.comments.push({
      user: req.body.user,
      text: req.body.text,
      time: req.body.time || new Date().toLocaleString(),
    });

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: 'Erreur ajout commentaire', error: err });
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
