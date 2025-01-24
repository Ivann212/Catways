const mongoose = require('mongoose');


const reservationSchema = mongoose.Schema (
    {
        catway: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'catway',
            required: true,
        },
        clientName: {
            type: String,
            required: true,
        },
        boatName: {
            type: String,
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
    }
)


module.exports = mongoose.model('reservation', reservationSchema);