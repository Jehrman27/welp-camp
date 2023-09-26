// module requirements
const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema; //shorten call to Schema

// schema for the campgrounds
const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

// middlware to delete reviews from a campground that was just deleted
CampgroundSchema.post('findOneAndDelete', async function(doc) {
   if(doc){
    // if a campground (doc) was deleted, remove all reviews that are found
    // in that campground's reviews array
    await Review.deleteMany({_id: { $in: doc.reviews}})
   }
})

// export model
module.exports = mongoose.model('Campground', CampgroundSchema);