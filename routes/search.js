const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search");

module.exports = router;


router.get("/", searchController.show);
router.get("/suggestions", searchController.suggestions);