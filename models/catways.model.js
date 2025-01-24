const mongoose = require('mongoose');


const catwaySchema = mongoose.Schema(
    {
        catwayNumber: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        catwayState: {
            type: String,
            required: true,
        }
    }
)

module.exports = mongoose.model('catway', catwaySchema);