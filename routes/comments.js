const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");

// ========================================================================================
//   COMMENTS ROUTES
// ========================================================================================

// comments new route
router.get("/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        res.redirect("/campgrounds");
      } else {
        res.render("comments/new", {campground: foundCampground});
      }
    });
  });
  
  // comments create route
  router.post("/", isLoggedIn, function(req, res){
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
            // add username and id to comment
            newestComment.author.id = req.user._id;
            newestComment.author.username = req.user.username;
            // save comment
            newestComment.save();
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

  // comments edit route
  router.get("/:comment_id/edit", (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
      if(err){
        res.redirect("back");
        console.log(err);
      } else {
        res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
      }
    })
  });

  // comments update route
  router.put("/:comment_id", (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err) => {
      if(err){
        console.log(err);
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  });

  // comments destroy route
  router.delete("/:comment_id", (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
      if(err){
        console.log(err);
        res.redirect("back");
      } else {
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  });

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }

  module.exports = router;