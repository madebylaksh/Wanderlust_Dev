const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/user");

module.exports = router;

router
    .route("/signup")
    .get(userController.renderSignUpForm)
    .post(userController.registerUser)

router
    .route("/login")
    .get(userController.renderLoginForm)
    .post((req,res,next)=>{req.origUrl = req.session.originalUrl; next();} , passport.authenticate("local", {failureFlash: true, failureRedirect: "/user/login"}), userController.loginUser)

router.get("/logout", userController.logoutUser)