const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Catway = require('./models/catway'); // Ajuste le chemin si nécessaire
const Reservation = require('./models/reservation'); // Si tu as un modèle pour les réservations
require('dotenv').config();

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.log('Erreur de connexion MongoDB:', err));

// Routes
app.get('/', (req, res) => {
    res.render('index'); // Page d'accueil
});

// Route pour afficher le tableau de bord
app.get('/dashboard', (req, res) => {
    res.render('dashboard'); // Page du tableau de bord
});

// Exemples de routes pour les utilisateurs
app.post('/users', (req, res) => {
    // Logique pour créer un utilisateur
});

app.post('/users/update', (req, res) => {
    // Logique pour modifier un utilisateur
});

app.post('/users/delete', (req, res) => {
    // Logique pour supprimer un utilisateur
});


app.get('/catways', async (req, res) => {
    try {
        const catways = await Catway.find();
        console.log("Catways récupérés:", catways); 
        res.render('catways', { catways });
    } catch (error) {
        console.error("Erreur lors de la récupération des catways:", error);
        res.status(500).send("Erreur serveur");
    }
});

app.get('/reservations', async (req, res) => {
    const reservations = await Reservation.find(); // Supposons que Reservation soit ton modèle
    res.render('reservations', { reservations });
});

// Route pour les détails d'un catway
app.get('/catways/:id', async (req, res) => {
    const catway = await Catway.findById(req.params.id);
    res.render('catway', { catway });
});

// Route pour les détails d'une réservation
app.get('/reservations/:id', async (req, res) => {
    const reservation = await Reservation.findById(req.params.id);
    res.render('reservation', { reservation });
});

// Corrected route for API documentation
app.get('/api-docs', (req, res) => {
    res.render('documentation'); // Render the documentation view
});

app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});
