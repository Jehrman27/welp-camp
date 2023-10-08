const Campground = require('../models/campground');
const Review = require('../models/review');

module.exports.createReview = async (req, res) =>{
    // get the campground form was submitted from
    const campground = await Campground.findById(req.params.id);

    // get the review data
    const review = new Review(req.body.review);

    // add current user to review
    review.author = req.user._id;

    // push the review data into the campground data
    campground.reviews.push(review);

    // save the data to the db
    await review.save();
    await campground.save();

    // flash success msg
    req.flash('success', 'Successfully created new review.');
    // redirect to the same campground
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // get campground and delete review objId from it
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    // get review and delete it
    await Review.findByIdAndDelete(reviewId);

    // flash success msg
    req.flash('success', 'Successfully deleted review.');

    // redirect to campground
    res.redirect(`/campgrounds/${id}`);
}