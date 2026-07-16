const Listing = require('../models/listing')

const showNewForm = (req, res) => {
    res.render('listings/new.ejs')
}

const create = async (req, res) => {
    const listingData = {}

    listingData.price = req.body.price
    listingData.streetAddress = req.body.streetAddress
    listingData.city = req.body.city
    listingData.size = req.body.size
    listingData.owner = req.session.user._id

    // if there is no image, we should not add it to the data object
    if (req.body.image) {
        listingData.image = req.body.image
    }

    let createdListing = await Listing.create(listingData)
    
    res.redirect('/listings')
}

const index = async (req, res) => {
    const allListings = await Listing.find().populate('owner')
    console.log(allListings)
    res.render('listings/index.ejs', {allListings})
}

const show = async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('owner')
    console.log(req.session.user)
    res.render('listings/show.ejs', {
        foundListing
    })
}

module.exports = {
    showNewForm,
    create,
    index,
    show,
}