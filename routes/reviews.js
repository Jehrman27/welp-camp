const express = require('express');
const router = express.Router({ mergeParams: true});

const Campground = require('../models/campground');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')

const { reviewSchema } = require('../schemas.js');



const validateReview = (req, res, next) => {
    // validation review data against schema and grab any errors
    const { error } = reviewSchema.validate(req.body);

    // throw errors, otherwise go to next middleware
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


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

    // redirect to the same campground
    res.redirect(`/campgrounds/${campground._id}`);
}));

// route for deleting individual reviews from a campground
router.delete('/:reviewId', catchAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;