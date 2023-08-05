// for seeding our database

// module requirements
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

// connect mongoose to mongo
mongoose.connect('mongodb://localhost:27017/welp-camp');
const db = mongoose.connection; // shorten call to db.
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () =>{
    console.log('Database connected');
});

// function to get random index in an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    // remove all entries in database
    await Campground.deleteMany({});

    // create 50 campgrounds with random names and locations
    for(let i=0; i <50; i++){
        // get random num for city
        const rand1000 = Math.floor(Math.random() * 1000);

        // create campground and lookup city and generate random title
        const camp = new Campground({
            location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        
        // save campground to db
        await camp.save();
    }
}

// run seeding and then close the connection
seedDB()
    .then(() =>{
        mongoose.connection.close();
    })