const Listing = require("../models/listing");
const Review = require("../models/review");


exports.writeReview = async (req,res)=> {
    const id = req.params.id;
    const review = req.body.review;

    const newReview = new Review(review);
    const listing = await Listing.findById(id);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    req.flash("success", "Review has been added."); 
    res.redirect(`/listings/${id}`);
}

exports.deleteReview = async (req,res)=> {
    const {id: listing_id, rid: review_id} = req.params;
    await Listing.findByIdAndUpdate(listing_id, {$pull: {reviews: review_id}});
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Your review has been deleted.");
    res.redirect(`/listings/${listing_id}`);
}