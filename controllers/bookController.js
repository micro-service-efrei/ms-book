const Book = require("../models/book");
const MessageQueue = require("../services/messageQueue");
const messageQueue = new MessageQueue();

// Ajouter un livre
exports.createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    await messageQueue.publishEvent("book.created", book);
    res.status(201).json(book);
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

    // Publier l'événement de suppression avec la bonne structure
    await messageQueue.publishEvent("book.deleted", {
      id: deletedBook._id,
      title: deletedBook.title,
    });

    res.json({ message: "Livre supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du livre:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Rechercher des livres
exports.getBooks = async (req, res) => {
  try {
    const { title, author, category, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (title) filter.title = { $regex: title, $options: "i" };
    if (author) filter.author = { $regex: author, $options: "i" };
    if (category) filter.categories = { $in: [category] };

    const total = await Book.countDocuments(filter);
    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      books,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
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

    // Publier l'événement de mise à jour avec la bonne structure
    await messageQueue.publishEvent("book.updated", updated);

    res.json(updated);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du livre:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
