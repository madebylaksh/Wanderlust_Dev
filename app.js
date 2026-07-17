require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const cookieparser = require("cookie-parser");
app.use(cookieparser("laksh"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const MONGO_URL = process.env.ATLASDB_URL;
async function main() { await mongoose.connect(MONGO_URL); }
main().then(()=>console.log("Connection to MongoDB successful.")).catch(e=> {console.error(e.message)});

const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo").default;
const store = MongoStore.create({
    mongoUrl: MONGO_URL,
    crypto: {
        secret: process.env.SESSION_SECRET
    },
    touchAfter: 24*3600
});
store.on("error", (e)=> {
    console.log("ERROR IN MONGO SESSION STORE: ",e);
});
const sessionOptions = {
    store,
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        expires: new Date(Date.now() + 7*24*60*60*1000),   // 1 week from now
        httpOnly: true
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=> {
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

const listingsRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");



const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=> {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.user = req.user;
    next();
})


// -----------------------------------------------------------------------------------Routes-----
const port = 8080;
app.listen(port, ()=>console.log("Server has started successfully on port "+port));

app.get("/", (req,res)=> {
    res.redirect("/listings");
})

app.use("/listings", listingsRouter);
app.use("/listings/:id/review", reviewRouter);
app.use("/user", userRouter);



// any other path handler
app.all("/*path", (req,res)=> {
    const path = req.params.path;
    const err = new Error;
    err.status = 404;
    err.message = `No page found at URL- /${path.join("/")}.`;
    throw err;
})

// global error handler
app.use((err,req,res,next)=> {
    const {status=505, message="Some error occured"} = err;
    console.log(status,message);
    res.status(status).render("error.ejs", {status, message});
})



