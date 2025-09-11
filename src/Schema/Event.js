const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  day: { type: String, required: true },
  hour: { type: String, required: true },
  title: { type: String, required: true },
  coach: { type: String },
  category: { type: String },
  imageUrl: { type: String }
});

module.exports = mongoose.model('Event', eventSchema);
