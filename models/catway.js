const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    catwayNumber: { type: Number, required: true },
    type: { type: String, required: true },
    catwayState: { type: String, required: true }
}, { collection: 'catways' });

module.exports = mongoose.model('Catway', catwaySchema);