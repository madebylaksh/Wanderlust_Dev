const express = require('express');
const router = express.Router();

const categoryController = require("../controllers/category");


module.exports = router;


// Index Route
router.get("/", (req,res)=> {res.redirect("/listings")});
router.get("/:category", categoryController.show);