const mongoose = require("mongoose");
const init = require("./data");
const Listing = require("../models/listing");
const Review = require("../models/review");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";




async function main() {
    await mongoose.connect(MONGO_URL);

    /* follow in-order -> 1st wait for connection to setup, then only call these functions */
    await initDB();
    // await uploadImages();
}
main().then(()=>console.log("connection successful")).catch(e=>console.log(e));






async function initDB() {
    // await Listing.deleteMany({});
    // await Listing.insertMany(init.data);
    // await Listing.updateMany({}, {owner: '6a57c944f39a0825e5d7a886'});
    // await Review.updateMany({}, {author: '6a57c944f39a0825e5d7a886'});
    console.log("Initialization Successful");
}

async function uploadImages() {
    require('dotenv').config();
    const {cloudinary} = require("../cloudConfig");
    const listings = await Listing.find({});
    for (let listing of listings) {
        const imageUrl = listing.image.url;
        const result = await cloudinary.uploader.upload(imageUrl, {
            folder: "wanderLust_DEV"
        });
        listing.image.url = result.secure_url;
        listing.image.filename = result.public_id;
        await listing.save();
    }
    console.log("successfully uploaded images on clouinary");
}