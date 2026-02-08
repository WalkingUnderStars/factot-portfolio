const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generează JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'  // Token-ul expiră în 30 de zile
  });
};

// @desc    Înregistrare utilizator nou
// @route   POST /api/auth/register
// @access  Public (oricine poate accesa)
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, userType, country, city } = req.body;
    
    // Validare - verificăm dacă avem toate datele necesare
    if (!email || !password || !firstName || !lastName || !country) {
      return res.status(400).json({
        success: false,
        message: 'Te rog completează toate câmpurile obligatorii'
      });
    }
    
    // Verifica daca utilizatorul există deja
    const userExists = await User.findOne({ where: { email } });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Un utilizator cu acest email există deja'
      });
    }
    
    // Validare parola
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Parola trebuie să aibă minim 6 caractere'
      });
    }
    
    // Creeaza utilizatorul
    const user = await User.create({
      email,
      passwordHash: password,  // Va fi hash-uit automat în model
      firstName,
      lastName,
      phone,
      userType: userType || 'both',
      country,
      city
    });
    
    // Genereaza token
    const token = generateToken(user.id);
    
    // Trimite răspuns
    res.status(201).json({
      success: true,
      message: 'Utilizator înregistrat cu succes!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          country: user.country
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Eroare register:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la înregistrare',
      error: error.message
    });
  }
};

// @desc    Login utilizator
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validare
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Te rog introduce email și parolă'
      });
    }
    
    // Gasește utilizatorul
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email sau parolă incorectă'
      });
    }
    
    // Verifica parola
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email sau parolă incorectă'
      });
    }
    
    // Generează token
    const token = generateToken(user.id);
    
    res.json({
      success: true,
      message: 'Login reușit!',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          country: user.country
        },
        token
      }
    });
    
  } catch (error) {
    console.error('Eroare login:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la login'
    });
  }
};

// @desc    Obtine profilul utilizatorului curent
// @route   GET /api/auth/me
// @access  Private (necesită token)
const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          userType: req.user.userType,
          country: req.user.country,
          city: req.user.city,
          rating: req.user.rating,
          walletBalance: req.user.walletBalance
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Eroare'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};