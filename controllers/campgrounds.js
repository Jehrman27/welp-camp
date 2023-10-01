const Campground = require('../models/campground');

module.exports.index = async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // grab campground data from request body
    const campground = new Campground(req.body.campground);

    // add user data to campground
    campground.author = req.user._id;

    // save campground data to db and then redirect to page for that campground
    await campground.save();
    req.flash('success', 'Successfully made a new campground.');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    // get campground by database id and populate reviews data
    const campground = await Campground.findById(req.params.id)
    .populate({
        // populate reviews
        path: 'reviews',
        populate: {
            // populate authors for each reviews
            path:'author'
        }
    })
    // populate author for each campground
    .populate('author');
    // flash error and redirect to index if campground found
    if(!campground){
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }
    // route to campground view and pass in campground obj
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    // destructure id from request parameters
    const {id} = req.params;

    // get campground by database id
    const campground = await Campground.findById(id);

    // flash error and redirect to index if campground found
    if(!campground){
        req.flash('error', 'Campground not found');
        res.redirect('/campgrounds');
    }

    // route to campground edit view and pass in campground obj
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    // destructure id from request parameters
    const {id} = req.params;

    // find campground by id and update by spreading campground from req
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});

    // flash success msg
    req.flash('success', 'Successfully updated campground.');

    // redirect to page for update campground
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    // destructure id from request parameters
    const {id} = req.params;

    // find campground and check if authro matches logged in user
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user.id)){
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campgrounds/${id}`)
    }

    // find and delete campground from db
    await Campground.findByIdAndDelete(id);

    // flash success msg
    req.flash('success', 'Successfully deleted campground.');
    // redirect to campgrounds index page
    res.redirect('/campgrounds');
}