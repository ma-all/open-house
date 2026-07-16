const Listing = require('../models/listing.js')

const create =  async (req, res) => {
    const foundListing = await Listing.findById(req.params.listingId)

    const questionData = {}
    questionData.text = req.body.text
    questionData.author = req.session.user._id

    foundListing.questions.push(questionData)
    await foundListing.save()

    res.redirect(`/listings/${req.params.listingId}`)
}

module.exports = {
    create,
}