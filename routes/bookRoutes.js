const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const MessageQueue = require('../services/messageQueue');
const authMiddleware = require('../middleware/auth');
const messageQueue = new MessageQueue();

// Route publique
router.get(['/', '/books'], bookController.getBooks);

// Routes protégées
router.post(['/', '/books'], authMiddleware, bookController.createBook);
router.put(['/:id', '/books/:id'], authMiddleware, bookController.updateBook);
router.delete(['/:id', '/books/:id'], authMiddleware, bookController.deleteBook);

// Route de test
router.post('/test-event', authMiddleware, async (req, res) => {
  try {
    const testData = {
      id: 'test-' + Date.now(),
      message: 'Test event',
      timestamp: new Date()
    };
    
    await messageQueue.publishEvent('book.test', testData);
    res.json({ 
      success: true, 
      message: 'Event de test envoyé',
      eventData: testData 
    });
  } catch (error) {
    console.error('Erreur lors du test:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
