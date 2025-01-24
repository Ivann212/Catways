const express = require('express');
const { getDashboard, deleteCatway, editCatway, createCatway, getUsers, setUsers, deleteUser  } = require('../controller/dashboard.controller');
const { authenticate, isAdmin } = require('../middleware/auth');
const { createReservation, deleteReservation } = require('../controller/reservation.controller');
const router = express.Router();

router.get('/', authenticate, isAdmin, getDashboard);


router.post('/catway', authenticate, isAdmin, createCatway );


router.put('/catway/:id', authenticate, isAdmin, editCatway);

router.delete('/catway/:id', authenticate, isAdmin, deleteCatway);

router.post('/reservation', authenticate, isAdmin, createReservation);

router.delete('/reservation/:id', authenticate, isAdmin, deleteReservation);

router.get('/users', authenticate, isAdmin, getUsers);

// Créer un utilisateur
router.post('/users', authenticate, isAdmin, setUsers);

// Supprimer un utilisateur
router.delete('/users/:id', authenticate, isAdmin, deleteUser);



module.exports = router;

