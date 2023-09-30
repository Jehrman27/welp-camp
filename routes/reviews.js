const express = require('express');
const router = express.Router({ mergeParams: true});
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware.js');

// create a new review on a specified campground
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// delete individual reviews from a campground
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;