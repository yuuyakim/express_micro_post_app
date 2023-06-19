var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const knex = require("../db/knex");
const User = require("../models/user");
const Post = require("../models/post");
const Relationship = require("../models/relationship");

// const connection = mysql.createConnection(conn_obj);

/* GET home page. */
router.get("/", async function (req, res, next) {
  const isAuth = req.isAuthenticated();
  console.log(isAuth);
  if (isAuth) {
    const user_id = req.user.id;
    const postCount = await Post.countByUserId(user_id);
    const followCount = await Relationship.followCount(user_id);
    const followerCount = await Relationship.followerCount(user_id);
    console.log(followCount);
    console.log(followerCount);
    knex("posts")
      .join("users", "posts.user_id", "users.id")
      .select("posts.id", "posts.content", "users.user_name", "users.id as user_id")
      .then((results) => {
        console.log(results);
        res.render("index", {
          title: "投稿一覧",
          isAuth: isAuth,
          posts: results,
          current_user: req.user,
          postCount: postCount,
          followCount: followCount,
          followerCount: followerCount,
        });
      });
  } else {
    res.render("index", {
      title: "ToDo App",
      isAuth: isAuth,
    });
  }
});

router.post("/posts", (req, res, next) => {
  const isAuth = req.isAuthenticated();
  knex("posts")
    .insert({
      content: req.body.content,
      user_id: req.user.id,
    })
    .then(() => res.redirect("/"));
});

router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));
router.use("/logout", require("./logout"));

router.use("/profile", require("./profile"));

module.exports = router;
