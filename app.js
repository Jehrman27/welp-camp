// module requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {campgroundSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const Campground = require('./models/campground');
const Review = require('./models/review');
const methodOverride = require('method-override');

// require routers
const campgrounds = require('./routes/campgrounds')

// connect mongoose to mongo
mongoose.connect('mongodb://localhost:27017/welp-camp');
const db = mongoose.connection; // shorten call to db.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});

// connect express
const app = express(); 

// setup ejs, views folder, and ejs-mate as engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

// url encoding for parsing res.body and setup method override to change POSTs
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));

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

// use routers
app.use('/campgrounds', campgrounds);

// root route
app.get('/', (req, res) =>{
    res.render('home');
});

// route for creating a new review on a specified campground
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) =>{
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
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}))

// catch all other urls with a 404 and send to error middleware
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Oops! Something went wrong.'
    res.status(statusCode).render('error', {err});
});

// open connection at localhost:3000
app.listen(3000, ()=> {
    console.log('Serving on port 3000');
});