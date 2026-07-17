const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const {listingSchema, reviewSchema} = require("./schema/schema");


module.exports.isLoggedIn = (req,res,next)=> {
    if (!req.isAuthenticated()) {
        req.session.originalUrl = req.originalUrl;
        req.flash("error", "Log in to perform this action.");
        return res.redirect("/user/login");
    }
    next();
}


module.exports.isOwner = async (req,res,next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing you requested for doesn't exist.");
    }
    if (!listing.owner.equals(req.user._id)) {
        throw new ExpressError (403, "You don't have the ownership for this listing.")
    }
    next();
}

module.exports.validateListing = function(req,res,next) {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        const e = new Error;
        e.status = 400;
        e.message = result.error.message;
        throw e;
    }
    next();
}

module.exports.validateReview = (req,res,next)=> {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400,error.message);
    }
    next();
}

module.exports.isReviewAuthor = async (req,res,next) => {
    const review_id = req.params.rid;
    const review = await Review.findById(review_id);
    if (!review) {
        throw ExpressError (404, "Review doesn't exist");
    }
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You aren't the author of this review.");
        const id = req.params.id;
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateImage = (req,res,next)=> {
    if (!req.file) {
        throw new ExpressError(400, "No image uploaded for the listing.");
    }
    next();
}