const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  console.log('JWT_SECRET utilisé dans ms-book:', process.env.JWT_SECRET);
  
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token d\'authentification manquant' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token reçu:', token.substring(0, 20) + '...');
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
      console.log('Décodage réussi:', { userId: decoded.id, username: decoded.username });
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Erreur de vérification:', {
        error: error.message,
        tokenStart: token.substring(0, 20),
        secretStart: process.env.JWT_SECRET.substring(0, 5),
        algorithm: 'HS256'
      });
      return res.status(401).json({ 
        error: 'Token invalid',
        details: `${error.message} (using algo: HS256)` 
      });
    }
  } catch (error) {
    console.error('Erreur middleware:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

module.exports = authMiddleware;