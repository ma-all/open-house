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
    res.render('listings/index.ejs', {allListings})
}

const show = async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId).populate('owner').populate('questions.author')
    res.render('listings/show.ejs', {
        foundListing
    })
}

const editListing = async (req, res) => {
    let foundListing = await Listing.findById(req.params.listingId)
    res.render('listings/edit.ejs', {
        foundListing
    })
}

const updateListing = async (req, res) => {
    let listingData = {}

    listingData.price = req.body.price
    listingData.streetAddress = req.body.streetAddress
    listingData.city = req.body.city
    listingData.size = req.body.size
    listingData.image = req.body.image

    await Listing.findByIdAndUpdate(req.params.listingId, listingData)
    res.redirect(`/listings/${req.params.listingId}`)
}

const favorite = async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.listingId, {
        $push: {favoritedByUsers: req.params.userId}
    })
    res.redirect(`/listings/${req.params.listingId}`)
}

const deleteListing = async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId)
    if(foundListing.owner.equals(req.session.user._id)){
        await Listing.findByIdAndDelete(req.params.listingId)
        res.redirect('/listings')
    } else {
        res.render('error,js', {
            msg: 'You dont have permission to do that'
        })
    }
    
}

module.exports = {
    showNewForm, create, index, show, deleteListing, editListing, updateListing, favorite,
}