const express       = require("express"),
      app           = express(),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      seedDB        = require("./seeds"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      User          = require("./models/user");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

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
  next();
});
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
  res.redirect("campgrounds");
});

//INDEX
app.get("/campgrounds", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
    }
  })
});


//CREATE
app.post("/campgrounds", function(req, res){
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let desc = req.body.description;
  let newCampground = {name: name, image: image, description: desc};
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
    } else {
      // redirect back to campgrounds page
      res.redirect("campgrounds");
    }
  });
});

//NEW
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

//SHOW
app.get("/campgrounds/:id", function(req, res){
  //find the campground with the associated ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err){
      console.log(err);
    } else {
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// ========================================================================================
//   COMMENTS ROUTES
// ========================================================================================

// comments new route
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.render("comments/new", {campground: foundCampground});
    }
  });
});

// comments create route
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  //lookup campground using id
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      console.log(err);
      res.redirect("/campgrounds");
    } else{
      Comment.create(req.body.comment, function(err, newestComment){
        if(err){
          console.log(err);
          res.redirect("/campgrounds");
        } else {
          foundCampground.comments.push(newestComment);
          foundCampground.save();
          res.redirect("/campgrounds/" + foundCampground.id);
        }
      });
    }
  });
  //create new comment
  //connect new comment to campground
  //redirect to campground show page
});

// ========================================================================================
//   AUTH ROUTES
// ========================================================================================

// show register form
app.get("/register", (req, res) => {
  res.render("register");
});

// sign up logic
app.post("/register", (req, res) => {
  let newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err){
      console.log(err);
      res.render("register");
      return;
    } 
    passport.authenticate("local")(req, res, () => {
      res.redirect("campgrounds");
    });
  });
});

//show login form
app.get("/login", (req, res) => {
  res.render("login");
});

// log in logic
app.post("/login", passport.authenticate("local", 
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }) ,(req, res) => {
});

// log out route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}



app.listen(3000, function(){
  console.log("YelpCamp Server is running on 3000");
});
