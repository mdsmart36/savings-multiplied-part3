var express = require('express');
var router = express.Router();
var UserController = require('../userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: "List an item to sell",
    username: UserController.getCurrentUser().username,
    item_props: {
      _id: "",
      title: "",
      image: "",
      price: "",
      endDate: ""
    } 
  });
});

module.exports = router;
