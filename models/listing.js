const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({

    streetAddress: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    price: {
        type: Number,
        required: true,
        min: 0, //minimum price
    },

    size: {
        type: Number,
        required: true,
        min: 0,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId, //stores a user's document object id
        ref: 'User', //references the model (user)
    },
}, {timestamps: true })

module.exports = Listing