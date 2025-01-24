const jwt = require('jsonwebtoken');
const UserModel = require('../models/users.model')

const authenticate = (req, res, next) => {
  // Récupérer le token depuis l'en-tête 'Authorization' ou depuis le cookie
  const token = req.headers['authorization']?.split(' ')[1] || req.cookies['token'];

  if (!token) {
    return res.status(403).json({ message: "Token manquant" });
  }

  // Vérification du token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Token invalide" });
    }

    req.user = decoded;  
    next();  // Passer au prochain middleware
  });
};

const isAdmin = (req, res, next, decoded) => {
  req.user = decoded; 
  req.user = {
    userId: decoded.userId,
    role: decoded.role
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès refusé. L\'utilisateur doit être administrateur.' });
  }
  
  next();
};

module.exports = { authenticate, isAdmin };


