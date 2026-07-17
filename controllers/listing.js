const Listing = require("../models/listing");


exports.index = async (req,res)=> {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

exports.renderNewForm = (req,res)=> {
    res.render("listings/new.ejs")
};

exports.showListing = async (req,res)=> {
    const id = req.params.id;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist.");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing, id});
}

exports.createNewListing = async (req,res)=> {
    const listing = req.body.listing;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;
    const url = req.file.path;
    const filename = req.file.filename;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New Listing has been created.");
    res.redirect("/listings");
}

exports.renderEditForm = async (req,res)=> {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for doesn't exist.");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("upload", "upload/c_fill,w_300,h_200");
    res.render("listings/edit.ejs", {id,listing, originalImageUrl});
}

exports.updateListing = async (req,res)=> {
    const id = req.params.id;
    const listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if (req.file) {
        listing.image = {url: req.file.path, filename: req.file.filename}
        await listing.save();
    }
    req.flash("success", "Data has been updated successfully.")
    res.redirect(`/listings/${id}`);    
}

exports.deleteListing = async(req,res)=> {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully.")
    res.redirect("/listings");
}
