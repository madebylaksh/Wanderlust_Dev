const listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

exports.show = async function(req,res,next) {
    let category = req.params.category;
    try {
        category = category.toLowerCase().split(" ").map(e=> e[0].toUpperCase() + e.slice(1)).join(" ");
    }
    catch(e) {
        throw new ExpressError(400, "Recheck the category name entered.");
    }
    const listings = await listing.find({"category": category});
    if (listings.length===0) {
        req.flash("error", "No listing found for this category.");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs", {allListings: listings});
}