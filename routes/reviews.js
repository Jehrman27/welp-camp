const express = require('express');
const router = express.Router({ mergeParams: true});

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');

const {validateReview} = require('../middleware.js');

// route for creating a new review on a specified campground
router.post('/', validateReview, catchAsync(async (req, res) =>{
    // get the campground form was submitted from
    const campground = await Campground.findById(req.params.id);

    // get the review data
    const review = new Review(req.body.review);

    // push the review data into the campground data
    campground.reviews.push(review);

    // save the data to the db
    await review.save();
    await campground.save();

    // flash success msg
    req.flash('success', 'Successfully created new review.');
    // redirect to the same campground
    res.redirect(`/campgrounds/${campground._id}`);
}));

// route for deleting individual reviews from a campground
router.delete('/:reviewId', catchAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    // get campground and delete review objId from it
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    // get review and delete it
    await Review.findByIdAndDelete(reviewId);

    // flash success msg
    req.flash('success', 'Successfully deleted review.');

    // redirect to campground
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;