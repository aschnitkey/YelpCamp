const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");

// ========================================================================================
//   COMMENTS ROUTES
// ========================================================================================

// comments new route
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        res.redirect("/campgrounds");
      } else {
        res.render("comments/new", {campground: foundCampground});
      }
    });
  });
  
  // comments create route
  router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        console.log(err);
        res.redirect("/campgrounds");
      } else{
        Comment.create(req.body.comment, function(err, newestComment){
          if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/campgrounds");
          } else {
            // add username and id to comment
            newestComment.author.id = req.user._id;
            newestComment.author.username = req.user.username;
            // save comment
            newestComment.save();
            foundCampground.comments.push(newestComment);
            foundCampground.save();
            req.flash("success", "Successfully added comment");
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
  router.get("/:comment_id/edit", middleware.checkCommentOwnership, (req, res) => {
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
  router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
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
  router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndDelete(req.params.comment_id, (err) => {
      if(err){
        console.log(err);
        res.redirect("back");
      } else {
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
      }
    });
  });

  module.exports = router;