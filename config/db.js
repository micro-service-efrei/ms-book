const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  const retryInterval = 5000;
  let currentRetry = 0;

  while (currentRetry < maxRetries) {
    try {
      await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mylibrary', {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        waitQueueTimeoutMS: 30000,
        heartbeatFrequencyMS: 2000
      });
      console.log('Connecté à MongoDB');
      return;
    } catch (error) {
      currentRetry++;
      console.log(`Tentative de connexion ${currentRetry}/${maxRetries} à MongoDB échouée`);
      if (currentRetry === maxRetries) {
        console.error('Erreur de connexion à MongoDB :', error);
        process.exit(1);
      }
      await new Promise(resolve => setTimeout(resolve, retryInterval));
    }
  }
};

module.exports = connectDB;
