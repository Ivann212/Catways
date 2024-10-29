const express = require('express');
const Catway = require('../models/catway');
const router = express.Router();

// Créer un catway
router.post('/', async (req, res) => {
    try {
        const catway = new Catway(req.body);
        await catway.save();
        res.status(201).json(catway);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Lister les catways
router.get('/', async (req, res) => {
    const catways = await Catway.find();
    res.json(catways);
});

// Récupérer les détails d'un catway
router.get('/:id', async (req, res) => {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway introuvable' });
    res.json(catway);
});

// Modifier un catway
router.put('/:id', async (req, res) => {
    try {
        const catway = await Catway.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!catway) return res.status(404).json({ error: 'Catway introuvable' });
        res.json(catway);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Supprimer un catway
router.delete('/:id', async (req, res) => {
    const catway = await Catway.findByIdAndDelete(req.params.id);
    if (!catway) return res.status(404).json({ error: 'Catway introuvable' });
    res.json({ message: 'Catway supprimé' });
});

module.exports = router;