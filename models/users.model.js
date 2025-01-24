const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: [true, "l'email est requis"],
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            trim: true,
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    
);

module.exports = mongoose.model('user', userSchema)