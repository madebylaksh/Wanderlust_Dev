const User = require("../models/user");



exports.renderSignUpForm = (req,res)=> {
    res.render("user/signup.ejs");
}

exports.registerUser = async (req,res)=> {
    try {
        const {username, email, pwd} = req.body;
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, pwd);
        req.login(registeredUser, (e)=> {
            if (e) {return next(e)}
            req.flash("success", "Welcome to WanderLust!");
            res.redirect("/listings");
        })
    }
    catch(e) {                                              // catch same username error and flash it
        req.flash("error", e.message);
        res.redirect("/user/signup");
    }
}

exports.renderLoginForm = (req,res)=> {
    if (req.isAuthenticated()) {req.flash("error", "You're already logged in"); return res.redirect("/listings");}
    res.render("user/login.ejs");
}

exports.loginUser = (req,res)=>{
    // successFlash wasn't working
    req.flash("success", "Welcome back to WanderLust.");
    res.redirect(req.origUrl || "/listings");                
}

exports.logoutUser = (req,res,next)=> {
    req.logout((e)=> {
        if (e) {return next(e)}
        req.flash("success", "Successfully Logged out from server.");
        res.redirect("/listings");
    })
}