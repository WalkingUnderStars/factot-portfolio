const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Midleware care protejeaza rutele - verifica daca utilizatorul are token valid
const protect = async (req, res, next) => {
  let token;

  // DEBUG - Să vedem ce primim
  console.log('=== DEBUG AUTH ===');
  console.log('Headers:', req.headers);
  console.log('Authorization header:', req.headers.authorization);
  console.log('==================');
  
  // Verifica daca exista token in header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extrage token-ul din header (Bearer TOKEN)
      token = req.headers.authorization.split(' ')[1];

      // Verifica si decodifica token-ul
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Gaseste utilizatorul din baza de date
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['passwordHash'] } // Nu include parola
      });

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: ' Utilizatorul nu a fost gasit'
        });
      }

      next(); // Continua la urmatoarea functie

    } catch (error) {
      console.error('Eroare autentificare:', error);
      return res.status(401).json({
        success: false,
        message: 'Token invalid sau expirat'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Nu esti autentificat - lipseste token-ul'
    });
  }
};

module.exports = { protect };