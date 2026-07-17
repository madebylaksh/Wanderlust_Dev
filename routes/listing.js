const express = require('express');
const router = express.Router();
const {isLoggedIn, isOwner, validateListing, validateImage} = require("../middleware");
const listingController = require("../controllers/listing");

const {storage} = require("../cloudConfig");
const multer = require("multer");
const upload = multer( {storage: storage});

module.exports = router;


// Index Route
router.get("/", listingController.index);

// New route
router.route("/new")
.get(isLoggedIn, listingController.renderNewForm)
.post(isLoggedIn, upload.single("avatar") , validateImage, validateListing,  listingController.createNewListing);

// Show Route
router.get("/:id", listingController.showListing);

// Edit and Update Route
router
    .route("/:id/edit")
    .get(isLoggedIn, isOwner, listingController.renderEditForm)
    .put(isLoggedIn, isOwner, upload.single("new-img"), validateListing, listingController.updateListing)


// Destroy Route
router.delete("/:id/delete", isLoggedIn, isOwner, listingController.deleteListing);



