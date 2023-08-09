// module requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const Campground = require('./models/campground');
const methodOverride = require('method-override');

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

// root route
app.get('/', (req, res) =>{
    res.render('home');
})

// route to show index of campgrounds
app.get('/campgrounds', async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

// page for creating new campgrounds
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
})

// route for individual campgrounds
app.get('/campgrounds/:id', async (req, res) => {
    // get campground by database id
    const campground = await Campground.findById(req.params.id);
    // route to campground view and pass in campground obj
    res.render('campgrounds/show', { campground });
})

// page for editing existing campgrounds
app.get('/campgrounds/:id/edit', async (req, res) => {
    // get campground by database id
    const campground = await Campground.findById(req.params.id);
    // route to campground edit view and pass in campground obj
    res.render('campgrounds/edit', { campground });
})

app.put('/campgrounds/:id', async (req, res) => {
    // destructure id from request parameters
    const {id} = req.params;
    // find campground by id and update by spreading campground from req
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground})
    // redirect to page for update campground
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id', async (req, res) => {
    // destructure id from request parameters
    const {id} = req.params;
    // find and delete campground from db
    await Campground.findByIdAndDelete(id);
    // redirect to campgrounds index page
    res.redirect('/campgrounds');
})

// open connection at localhost:3000
app.listen(3000, ()=> {
    console.log('Serving on port 3000');
})