const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  categories: { type: [String], default: [] },
  publishedDate: { type: Date },
  description: { type: String }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
