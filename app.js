const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      Campground  = require("./models/campground"),
      seedDB      = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
seedDB();

app.get("/", function(req, res){
  res.render("landing");
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

app.get("/campgrounds/:id/comments/new", function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err){
      res.redirect("/campgrounds");
    } else {
      res.render("comments/new", {campground: foundCampground});
    }
  });
});




app.listen(3000, function(){
  console.log("YelpCamp Server is running on 3000");
});
