var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use("/signup", require("./signup"));
router.use("/signin", require("./signin"));

module.exports = router;
