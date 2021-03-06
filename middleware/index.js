const Campground = require("../models/campground");
const Comment = require("../models/comment");

// all the middleware goes here
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, foundCampground) => {
          if(err){
            console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("back");
          } else {
            //does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)){
              next();
            } else {
              //otherwise, redirect
              req.flash("error", "You don't have permission to do that");
              res.redirect("back");
            }
          }
        });
      //if not, redirect
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err, foundComment) => {
          if(err){
            console.log(err);
            res.redirect("back");
          } else {
            //does user own the campground?
            if(foundComment.author.id.equals(req.user._id)){
              next();
            } else {
              //otherwise, redirect
              req.flash("You don't have permission to do that");
              res.redirect("back");
            }
          }
        });
      //if not, redirect
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    } 
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;