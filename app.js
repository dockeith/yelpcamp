const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  passport = require("passport"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  Campground = require("./models/campground"),
  Comment = require("./models/comment"),
  User = require("./models/user"),
  seedDb = require("./seeds");

// Dev env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Requiring routes
const indexRoutes = require("./routes/index"),
  campgroundRoutes = require("./routes/campgrounds"),
  commentRoutes = require("./routes/comments");

// General config
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);

mongoose
  .connect(process.env.DATABASEURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to DB!");
  })
  .catch(err => {
    console.log("ERROR", err.message);
  });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Passport config
app.use(
  require("express-session")({
    secret: "Manchester United is the greatest football club in history.",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Send user object to all routes
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Use route files
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// Start server
app.listen(process.env.PORT || 3000, process.env.IP, function() {
  console.log("YelpCamp has started!");
});
