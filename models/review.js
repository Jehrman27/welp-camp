// module requirements
const mongoose = require('mongoose');
const Schema = mongoose.Schema; //shorten call to Schema

// schema for the reviews
const reviewSchema = new Schema({
    body: String,
    rating: Number
});

// export model
module.exports = mongoose.model('Review', reviewSchema);