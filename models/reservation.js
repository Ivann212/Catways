const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    catway: { type: mongoose.Schema.Types.ObjectId, ref: 'Catway', required: true },
    user: { type: String, required: true },  // Ex: nom de l'utilisateur ou son id
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});

module.exports = mongoose.model('Reservation', reservationSchema);