const Listing = require('../models/listing')
const cloudinary = require('../config/cloudinary')

const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'open-house/listings',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(fileBuffer)
  })
}

const showNewForm = (req, res) => {
    res.render('listings/new.ejs')
}

const create = async (req, res) => {
    //user can't do anything without uploading image
    if(!req.file) {
        return res.render('error.ejs', {
            msg: 'Please select an image.'
        })
    }

    const uploadedImage = await uploadImage(req.file.buffer)
    
    const listingData = {}

    listingData.price = req.body.price
    listingData.streetAddress = req.body.streetAddress
    listingData.city = req.body.city
    listingData.size = req.body.size
    listingData.owner = req.session.user._id
    listingData.image = {
        url: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
    }

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
    const userHasFavorited = foundListing.favoritedByUsers.some((user) => {
        return user.equals(req.session.user._id)
    })
    res.render('listings/show.ejs', {
        foundListing,
        userHasFavorited
    })
}

const editListing = async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId)
    res.render('listings/edit.ejs', {
        foundListing
    })
}

const updateListing = async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId)
    const oldPublicId = foundListing.image?.publicId
    let listingData = {}

    listingData.price = req.body.price
    listingData.streetAddress = req.body.streetAddress
    listingData.city = req.body.city
    listingData.size = req.body.size
    // listingData.image = req.body.image

    if(req.file){
        const uploadedImage = await uploadImage(req.file.buffer)
        foundListing.image = {
            url: uploadedImage.secure_url,
            publicId: uploadedImage.public_id,
        }
    }

    await foundListing.save()

    await Listing.findByIdAndUpdate(req.params.listingId, listingData)
    res.redirect(`/listings/${req.params.listingId}`)
}

const favorite = async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.listingId, {
        $push: {favoritedByUsers: req.params.userId}
    })
    res.redirect(`/listings/${req.params.listingId}`)
}

const unfavorite = async (req, res) => {
    await Listing.findByIdAndUpdate(req.params.listingId, {
        $pull: {favoritedByUsers: req.params.userId}
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
    showNewForm, create, index, show, deleteListing, editListing, updateListing, favorite, unfavorite,
}