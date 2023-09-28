const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { campgroundSchema } = require('../schemas.js');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { model } = require('mongoose');

const validateCampground = (req, res, next) => {
    // validation campground data against schema and grab any errors
    const {error} = campgroundSchema.validate(req.body);

    // throw errors, otherwise go to next middleware
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// route to show index of campgrounds
router.get('/', catchAsync(async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));

// page for creating new campgrounds
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // catch if campground data is incomplete
    //if(!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);

    // grab campground data from request body
    const campground = new Campground(req.body.campground);

    // save campground data to db and then redirect to page for that campground
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

// route for individual campgrounds
router.get('/:id', catchAsync(async (req, res) => {
    // get campground by database id and populate reviews data
    const campground = await Campground.findById(req.params.id).populate('reviews');

    // route to campground view and pass in campground obj
    res.render('campgrounds/show', { campground });
}));

// page for editing existing campgrounds
router.get('/:id/edit', catchAsync(async (req, res) => {
    // get campground by database id
    const campground = await Campground.findById(req.params.id);

    // route to campground edit view and pass in campground obj
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    // destructure id from request parameters
    const {id} = req.params;

    // find campground by id and update by spreading campground from req
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});

    // redirect to page for update campground
    res.redirect(`/campgrounds/${campground._id}`);
}));

// route for deleting campgrounds
router.delete('/:id', catchAsync(async (req, res) => {
    // destructure id from request parameters
    const {id} = req.params;

    // find and delete campground from db
    await Campground.findByIdAndDelete(id);

    // redirect to campgrounds index page
    res.redirect('/campgrounds');
}));

module.exports = router;