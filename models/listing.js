const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema({
    price: {
        type: Number,
        required: true,
        min: 0, 
    },
    image: {
        type: String,
        default: 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg',
    },
    streetAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
        min: 0,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true } )

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing