const express = require('express');
const router = express.Router();
const postController = require('../controller/post.controller');
const multer = require('multer');
const path = require('path');

// 🔹 Configuration multer pour uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Routes
router.get('/', postController.getPosts);
router.post('/', upload.single('media'), postController.createPost);
router.post('/:id/like', postController.likePost);
router.post('/:id/comment', postController.addComment);
router.delete('/:id', postController.deletePost);

module.exports = router;
