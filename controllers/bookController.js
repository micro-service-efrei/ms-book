const Book = require('../models/book');

// Ajouter un livre
exports.createBook = async (req, res) => {
  try {
    const { title, author, categories, publishedDate, description } = req.body;

    const newBook = new Book({
      title,
      author,
      categories,
      publishedDate: publishedDate ? new Date(publishedDate) : undefined,
      description
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }
    res.json({ message: "Livre supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du livre:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Rechercher des livres
exports.getBooks = async (req, res) => {
  try {
    const { title, author, category } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title, $options: 'i' };
    if (author) filter.author = { $regex: author, $options: 'i' };
    if (category) filter.categories = { $in: [category] };

    const books = await Book.find(filter);
    res.json(books);
  } catch (error) {
    console.error("Erreur lors de la recherche des livres:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Mettre à jour un livre
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, categories, publishedDate, description } = req.body;
    
    const updated = await Book.findByIdAndUpdate(
      id,
      { title, author, categories, publishedDate, description },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du livre:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
