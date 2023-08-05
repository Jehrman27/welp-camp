// module requirements
const mongoose = require('mongoose');
const Schema = mongoose.Schema; //shorten call to Schema

// schema for the campgrounds
const CampgroundSchema = new Schema({
    title: String,
    price: String,
    description: String,
    location: String
});

// export model
module.exports = mongoose.model('Campground', CampgroundSchema);