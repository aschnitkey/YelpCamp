const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// ========================================================================================
//   COMMENTS ROUTES
// ========================================================================================

// comments new route
router.get("/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        res.redirect("/campgrounds");
      } else {
        res.render("comments/new", {campground: foundCampground});
      }
    });
  });
  
  // comments create route
  router.post("/comments", isLoggedIn, function(req, res){
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

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }

  module.exports = router;