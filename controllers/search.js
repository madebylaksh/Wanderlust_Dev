const Listing = require("../models/listing");

exports.suggestions = async (req,res,next)=> {
    const search = req.query.search.trim();
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");

    // search should have min of 3 characters
    if (search.length < 3) {
        return res.json([]);
    }
    const listings = await Listing.find({
        $or: [
            {title: regex}, 
            {country: regex}, 
            {location: regex},
            {category: regex}
        ]
    })
    .limit(8)
    .select('_id title country location');
    res.json(listings);
}

exports.show = async(req,res,next)=> {
    const search = req.query.search;
    const listings = Listing.
}