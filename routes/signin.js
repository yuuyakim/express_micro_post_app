var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const knex = require("../db/knex");
const passport = require("passport");

router.get("/", function (req, res, next) {
  const isAuth = req.isAuthenticated();
  res.render("signin", { title: "Sign In", isAuth: isAuth });
});

router.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

module.exports = router;
