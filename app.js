// module requirements
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override');

// require routers
const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')

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
app.use(express.static(path.join(__dirname, 'public')));

// use routers
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

// root route
app.get('/', (req, res) =>{
    res.render('home');
});

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