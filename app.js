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