const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  categories: [String],
  publishedDate: Date,
  description: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
