const mongoose = require('mongoose')

const questionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, 
    
}, { timestamps: true } )
    

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
    questions: [questionSchema], 
    favoritedByUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true } )

const Listing = mongoose.model('Listing', listingSchema)

module.exports = Listing