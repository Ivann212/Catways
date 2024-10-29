const express = require('express');
const Reservation = require('../models/reservation');
const Catway = require('../models/catway');
const router = express.Router();

// Prendre une réservation
router.post('/', async (req, res) => {
    try {
        const reservation = new Reservation(req.body);
        await reservation.save();
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Lister les réservations
router.get('/', async (req, res) => {
    const reservations = await Reservation.find().populate('catway');
    res.json(reservations);
});

// Récupérer les détails d'une réservation
router.get('/:id', async (req, res) => {
    const reservation = await Reservation.findById(req.params.id).populate('catway');
    if (!reservation) return res.status(404).json({ error: 'Réservation introuvable' });
    res.json(reservation);
});

// Supprimer une réservation
router.delete('/:id', async (req, res) => {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ error: 'Réservation introuvable' });
    res.json({ message: 'Réservation supprimée' });
});

module.exports = router;