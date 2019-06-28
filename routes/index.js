const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


//root route
router.get("/", function(req, res){
    res.redirect("campgrounds");
  });

  
  // ========================================================================================
  //   AUTH ROUTES
  // ========================================================================================
  
  // show register form
  router.get("/register", (req, res) => {
    res.render("register");
  });
  
  // sign up logic
  router.post("/register", (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
      if(err){
        console.log(err);
        req.flash("error", err.message);
        res.redirect("register");
        return;
      } 
      passport.authenticate("local")(req, res, () => {
        req.flash("success", "Welcome to YelpCamp " + user.username);
        res.redirect("campgrounds");
      });
    });
  });

  //show login form
router.get("/login", (req, res) => {
    res.render("login");
  });
  
  // log in logic
  router.post("/login", passport.authenticate("local", 
    {
      successRedirect: "/campgrounds",
      failureRedirect: "/login"
    }) ,(req, res) => {
  });
  
  // log out route
  router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged You Out!");
    res.redirect("/campgrounds");
  });

  module.exports = router;