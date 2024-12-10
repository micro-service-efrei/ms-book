const Book = require('../models/book');
const bookController = require('../controllers/bookController');

jest.mock('../models/Book', () => {
    // On retourne une fonction (un constructeur mocké)
    const BookMock = jest.fn();
    
    // On ajoute les méthodes statiques mockées
    BookMock.find = jest.fn();
    BookMock.findByIdAndDelete = jest.fn();
    BookMock.findByIdAndUpdate = jest.fn();
    
    // La méthode instance `save`
    BookMock.prototype.save = jest.fn();
    
    return BookMock;
  });

describe('bookController', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('createBook', () => {
    it('devrait créer un livre et retourner 201', async () => {
      // Mock des données d'entrée
      req.body = {
        title: 'Test Book',
        author: 'John Doe',
        categories: ['Test', 'Jest'],
        publishedDate: '2020-01-01',
        description: 'Un livre de test'
      };

      // Mock du comportement du modèle Book
      const fakeBook = { ...req.body, _id: '12345' };
      Book.mockImplementation(() => {
        return {
          save: jest.fn().mockResolvedValue(fakeBook)
        };
      });

      await bookController.createBook(req, res);

      // On vérifie que `Book` a été appelé avec les bons arguments
      expect(Book).toHaveBeenCalledWith({
        title: 'Test Book',
        author: 'John Doe',
        categories: ['Test', 'Jest'],
        publishedDate: new Date('2020-01-01'),
        description: 'Un livre de test'
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeBook);
    });

    it("devrait retourner une erreur 500 si la création échoue", async () => {
        req.body = { title: 'Test Book' };
        
        // On mock l'implémentation du constructeur pour que save() rejette
        Book.mockImplementation(() => {
          return {
            save: jest.fn().mockRejectedValue(new Error('DB Error'))
          };
        });
      
        await bookController.createBook(req, res);
      
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
      });      
  });

  describe('getBooks', () => {
    it('devrait retourner une liste de livres', async () => {
      const fakeBooks = [
        { _id: '1', title: 'Book 1', author: 'Author 1' },
        { _id: '2', title: 'Book 2', author: 'Author 2' }
      ];

      // Pas de params spéciaux
      req.query = {};
      Book.find.mockResolvedValue(fakeBooks);

      await bookController.getBooks(req, res);

      expect(Book.find).toHaveBeenCalledWith({});
      expect(res.json).toHaveBeenCalledWith(fakeBooks);
    });

    it('devrait filtrer par titre', async () => {
      req.query = { title: 'Prince' };
      const expectedFilter = { title: { $regex: 'Prince', $options: 'i' } };

      Book.find.mockResolvedValue([]);
      await bookController.getBooks(req, res);

      expect(Book.find).toHaveBeenCalledWith(expectedFilter);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('devrait retourner une erreur 500 en cas de problème', async () => {
      req.query = {};
      Book.find.mockRejectedValue(new Error('DB Error'));

      await bookController.getBooks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
    });
  });
});
