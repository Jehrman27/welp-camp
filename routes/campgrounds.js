const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds');
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware.js');

const Campground = require('../models/campground');

// route to show index of campgrounds
router.get('/', catchAsync(campgrounds.index));

// page for creating new campgrounds
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// route for making a new campground
router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

// route for individual campgrounds
router.get('/:id', catchAsync(campgrounds.showCampground));

// page for editing existing campgrounds
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// route for updating a campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

// route for deleting campgrounds
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;