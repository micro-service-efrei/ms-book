const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const MessageQueue = require('../services/messageQueue');
const messageQueue = new MessageQueue();

// Routes CRUD
router.post('/', bookController.createBook);
router.get('/', bookController.getBooks);
router.put('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// Route de test pour les événements
router.post('/test-event', async (req, res) => {
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
