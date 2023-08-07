// module requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

// connect mongoose to mongo
mongoose.connect('mongodb://localhost:27017/welp-camp');
const db = mongoose.connection; // shorten call to db.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});

// connect express
const app = express(); 

// setup ejs and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// root route
app.get('/', (req, res) =>{
    res.render('home');
})

// route to show index of campgrounds
app.get('/campgrounds', async (req, res) =>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
})

// route for individual campgrounds
app.get('/campgrounds/:id', async (req, res) => {
    // get campground by database id
    const campground = await Campground.findById(req.params.id);
    // route to show view and pass in campground obj
    res.render('campgrounds/show', { campground });
})

// DEBUGGING - create a campground
app.get('/makecampground', async (req, res) =>{
    const camp = new Campground({title: 'My Backyard', description: 'Cheap camping'});
    await camp.save();
    res.send(camp);
})

// open connection at localhost:3000
app.listen(3000, ()=> {
    console.log('Serving on port 3000');
})