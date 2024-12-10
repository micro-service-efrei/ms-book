const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const MessageQueue = require('./services/messageQueue');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const messageQueue = new MessageQueue();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/books', bookRoutes);

// Healthcheck endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Connexion à la base de données et RabbitMQ
Promise.all([
  connectDB(),
  messageQueue.connect()
]).then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  });
}).catch(err => {
  console.error('Erreur lors du démarrage:', err);
  process.exit(1);
});
