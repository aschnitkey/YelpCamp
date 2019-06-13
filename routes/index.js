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
        res.render("register");
        return;
      } 
      passport.authenticate("local")(req, res, () => {
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
    res.redirect("/campgrounds");
  });
  
  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login");
  }

  module.exports = router;