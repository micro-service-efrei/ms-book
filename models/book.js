const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Le titre est requis'],
    trim: true,
    minlength: [2, 'Le titre doit contenir au moins 2 caractères']
  },
  author: { 
    type: String, 
    required: [true, "Le nom de l'auteur est requis"],
    trim: true
  },
  categories: { 
    type: [String], 
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Au moins une catégorie est requise'
    }
  },
  publishedDate: { type: Date },
  description: { type: String }
}, {
  timestamps: true
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
