const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Post = require("../models/post");
const Relationship = require("../models/relationship");
const knex = require("../db/knex");

router.get("/:user_id", async (req, res, next) => {
  const isAuth = req.isAuthenticated();
  const my_user_id = req.user.id;
  const user_id = req.params.user_id;
  const user = await User.findById(user_id);
  const postCount = await Post.countByUserId(user_id);
  const followCount = await Relationship.followCount(user_id);
  const followerCount = await Relationship.followerCount(user_id);
  const followList = await Relationship.followList(my_user_id);

  knex("posts")
    .where({ user_id: user_id })
    .join("users", "posts.user_id", "users.id")
    .select(
      "posts.id",
      "posts.content",
      "users.user_name",
      "users.id as user_id"
    )
    .then((results) => {
      res.render("profile", {
        isAuth: isAuth,
        my_user_id: my_user_id,
        user: user,
        posts: results,
        postCount: postCount,
        followCount: followCount,
        followerCount: followerCount,
        followList: followList,
      });
    });
});

router.post("/follow", async (req, res, next) => {
  const userId = req.user.id;
  const followUserId = req.body.follow_user_id;
  await knex("relationships")
    .insert({
      user_id: userId,
      follow_user_id: followUserId,
    })
    .then(() => res.redirect(`/profile/${followUserId}`))
    .catch((err) => {});
});

router.post("/unfollow", async (req, res, next) => {
  const userId = req.user.id;
  const followUserId = req.body.follow_user_id;

  await Relationship.unFollow(userId, followUserId).then(() => {
    res.redirect(`/profile/${followUserId}`);
  });
});

module.exports = router;
