const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const Relationship = require("../models/relationship");
const knex = require("../db/knex");

router.get("/:user_id", async (req, res, next) => {
  const isAuth = req.isAuthenticated();
  const user_id = req.params.user_id;
  const user = await User.findById(user_id);
  const postCount = await Post.countByUserId(user_id);
  const followCount = await Relationship.followCount(user_id);
  const followerCount = await Relationship.followerCount(user_id);
  res.render("profile", {
    isAuth: isAuth,
    user: user,
    postCount: postCount,
    followCount: followCount,
    followerCount: followerCount,
  });
});

router.post("/follow", async (req, res, next) => {
  const user_id = req.user.id
  const follow_user_id = 1
  knex("relationships")
    .insert({
      user_id: user_id,
      follow_user_id: follow_user_id,
    })
    .then(() => res.redirect("/"))
    .catch((err) => {});
});

module.exports = router;
