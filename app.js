const express          = require("express"),
      app              = express(),
      bodyParser       = require("body-parser"),
      mongoose         = require("mongoose"),
      Campground       = require("./models/campground"),
      Comment          = require("./models/comment"),
      seedDB           = require("./seeds"),
      passport         = require("passport"),
      LocalStrategy    = require("passport-local"),
      User             = require("./models/user"),
      methodOverride   = require("method-override"),
      flash            = require("connect-flash");

const commentRoutes = require("./routes/comments");
const campgroundRoutes = require("./routes/campgrounds");
const authRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true, useFindAndModify: false});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// Passport Configuration
app.use(require("express-session")({
  secret: "Once again Rusty wins cutest dog!",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(3000, function(){
  console.log("YelpCamp Server is running on 3000");
});
