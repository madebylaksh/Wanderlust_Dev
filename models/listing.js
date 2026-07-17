const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

const DEFAULT_IMG_URL = "https://images.unsplash.com/photo-1769988360305-baaa1cfb006d?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: {
            type: String,
            default: DEFAULT_IMG_URL,
            set: v=> v==="" ? DEFAULT_IMG_URL : v
        }
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {   
            type: mongoose.Schema.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }   
});

// listing = argument
schema.post("findOneAndDelete", async (listing)=> {
    if (listing!==undefined) {
        await Review.deleteMany({_id: {$in: listing.reviews} });
    }
})

const Listing = mongoose.model("Listing", schema);

module.exports = Listing;