const express = require('express');
const { createReservation, deleteReservation, getReservations } = require('../controller/reservation.controller');
const isAdmin = require('../middleware/auth');
const router = express.Router();




router.get('/', getReservations)
router.post('/reserve', isAdmin, createReservation);  
router.delete('/reserve/:id', isAdmin, deleteReservation);  

module.exports = router;
