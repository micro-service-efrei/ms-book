const bookController = require('../controllers/bookController');
const Book = require('../models/book');
const MessageQueue = require('../services/messageQueue');

// Mock MessageQueue
jest.mock('../services/messageQueue', () => {
  return jest.fn().mockImplementation(() => ({
    publishEvent: jest.fn().mockResolvedValue(true)
  }));
});

// Mock Book model
jest.mock('../models/book', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn()
}));

describe('bookController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('createBook', () => {
    const mockBook = {
      title: 'Test Book',
      author: 'John Doe',
      categories: ['Test'],
      publishedDate: '2020-01-01',
      description: 'Un livre de test',
      _id: '12345'
    };

    it('devrait créer un livre et retourner 201', async () => {
      req.body = mockBook;
      Book.create.mockResolvedValueOnce(mockBook);

      await bookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockBook);
    });

    it('devrait retourner une erreur 500 si la création échoue', async () => {
      Book.create.mockRejectedValueOnce(new Error('DB Error'));

      await bookController.createBook(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Erreur interne du serveur" });
    });
  });

  describe('getBooks', () => {
    const mockBooks = [
      { _id: '1', title: 'Book 1' },
      { _id: '2', title: 'Book 2' }
    ];

    beforeEach(() => {
      Book.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockBooks)
      });
      Book.countDocuments.mockResolvedValue(2);
    });

    it('devrait retourner une liste de livres', async () => {
      await bookController.getBooks(req, res);

      expect(Book.countDocuments).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        books: mockBooks,
        pagination: expect.any(Object)
      });
    });

    it('devrait filtrer par titre', async () => {
      req.query = { title: 'Book' };
      await bookController.getBooks(req, res);

      expect(Book.countDocuments).toHaveBeenCalledWith({
        title: { $regex: 'Book', $options: 'i' }
      });
    });
  });
});
