const express = require("express");
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
const reviewController = require("../controllers/review");

module.exports = router;

// POST Review
router.post("/", isLoggedIn, validateReview, reviewController.writeReview);

// Destroy Review
router
    .route("/:rid")
    .delete(isLoggedIn, isReviewAuthor, reviewController.deleteReview)
    .get((req,res)=> {                               // to handle isLoggedIn redirect url request
        const id = req.params.id;
        res.redirect(`/listings/${id}`);
    });


