var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const knex = require("../db/knex");

router.get("/", function (req, res, next) {
  const isAuth = req.isAuthenticated();
  res.render("signup", { title: "Sign Up", isAuth: isAuth });
});

router.post("/", (req, res, next) => {
  const isAuth = req.isAuthenticated();
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const repassword = req.body.repassword;

  console.log(req.body);
  console.log(username);
  console.log(email);
  console.log(password);
  console.log(repassword);

  knex("users")
    .where({ user_name: username })
    .select("*")
    .then(async (results) => {
      if (results.length !== 0) {
        res.render("signup", {
          title: "Sign Up",
          isAuth: isAuth,
          errorMessage: ["既に使用されているUsername, またはemailです。"],
        });
      } else if (password === repassword) {
        const hashedPassword = await bcrypt.hash(password, 10);
        knex("users")
          .insert({
            user_name: username,
            email: email,
            password: hashedPassword,
          })
          .then(() => res.redirect("/"))
          .catch((err) => {
            res.render("signup", {
              title: "sign Up",
              isAuth: isAuth,
              errorMessage: [err.sqlMessage],
            });
          });
      } else {
        res.render("signup", {
          title: "signUp",
          isAuth: isAuth,
          errorMessage: ["パスワードが一致しません"],
        });
      }
    })
    .catch((err) => {
      res.render("signup", {
        title: "signup",
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

module.exports = router;
