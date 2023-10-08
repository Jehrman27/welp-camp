const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware.js');

const Campground = require('../models/campground');

// index and creating new campgrounds
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// form for creating new campgrounds
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// show/edit/delet specific campgrounds
router.route('/:id')
.get(catchAsync(campgrounds.showCampground))
.put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

// edit existing campgrounds
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;