const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");

//INDEX
router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/index", {campgrounds: allCampgrounds});
      }
    })
  });
  
  
  //CREATE
  router.post("/", isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let image = req.body.image;
    let desc = req.body.description;
    let author = {
      id: req.user._id,
      username: req.user.username
    }
    let newCampground = {name: name, image: image, description: desc, author: author};
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
  router.get("/new", isLoggedIn, function(req, res){
    res.render("campgrounds/new");
  });
  
  //SHOW
  router.get("/:id", function(req, res){
    //find the campground with the associated ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
      if(err){
        console.log(err);
      } else {
        res.render("campgrounds/show", {campground: foundCampground});
      }
    });
  });

  //EDIT CAMPGROUND ROUTE
  router.get("/:id/edit", checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
      res.render("campgrounds/edit",{campground: foundCampground});
    });
  });

  //UPDATE CAMPGROUND ROUTE
  router.put("/:id", checkCampgroundOwnership, (req, res) => {
    //find and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
      if(err) {
        console.log(err);
        res.redirect("/campgrounds");
      } else {
        //redirect somewhere (show page)
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  });

  //DESTROY CAMPGROUND ROUTE
  router.delete("/:id", checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err) => {
      if(err){
        console.log(err);
        res.redirect("/campgrounds/" + req.params.id);
      } else {
        res.redirect("/campgrounds");
      }
    });
  });

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }

  function checkCampgroundOwnership(req, res, next) {
    if(req.isAuthenticated()){
      Campground.findById(req.params.id, (err, foundCampground) => {
        if(err){
          console.log(err);
          res.redirect("back");
        } else {
          //does user own the campground?
          if(foundCampground.author.id.equals(req.user._id)){
            next();
          } else {
             //otherwise, redirect
            res.redirect("back");
          }
        }
      });
    //if not, redirect
    } else {
      res.redirect("back");
    } 
  }

  module.exports = router;