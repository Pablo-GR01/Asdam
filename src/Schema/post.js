const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: String, default: () => new Date().toLocaleString() }
});

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: String, required: true },
  media: { type: String }, // nom du fichier si upload
  likes: { type: Number, default: 0 },
  isLiked: { type: Boolean, default: false },
  isBookmarked: { type: Boolean, default: false },
  comments: [commentSchema],
  shares: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
