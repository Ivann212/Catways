const mongoose = require('mongoose');

const catwaySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    location: String,
    available: { type: Boolean, default: true }
});

module.exports = mongoose.model('Catway', catwaySchema);