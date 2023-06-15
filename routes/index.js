var express = require("express");
var router = express.Router();
const mysql = require("mysql");
const knex = require("../db/knex");
const User = require("../models/user");

// const connection = mysql.createConnection(conn_obj);

/* GET home page. */
router.get("/", function (req, res, next) {
  const isAuth = req.isAuthenticated();
  knex("posts")
    .join("users", "posts.user_id", "users.id")
    .select("posts.id", "posts.content", "users.user_name")
    .then((results) => {
      console.log(results);
      res.render("index", {
        title: "投稿一覧",
        isAuth: isAuth,
        posts: results,
      });
    });
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

module.exports = router;
