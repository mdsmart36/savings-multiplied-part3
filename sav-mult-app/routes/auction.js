var UserController = require('../userController');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Item = require('../models/auctionItem');

mongoose.connect('mongodb://localhost/savingsMultiplied');

// TO RUN THE APP LOCALLY
// DB=mongodb://localhost/savingsMultiplied node bin/www
//mongoose.connect(process.env.DB);

var db = mongoose.connection;

// check for errors on database connection
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("connected to auction item database");
});


// find auction item by id in order to edit

router.get('/:id', function (req, res) {

    // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  Item.find({ _id: req.params.id }, function (err, item) {
    console.log("looking for item in database");
    console.log(item[0]);
    var editItem = item[0];
    if (err) {
      console.log(err);
    }
    else {
      res.render('index', {
        title: "Edit an Item listed for sale",
        username: UserController.getCurrentUser().username,
        item_props: editItem
      });
    }
  });
});


// GET book listing page
router.get('/', function(req, res, next) {

  // Is the user logged in?
  if (UserController.getCurrentUser() === null) {
    res.redirect("/");
  }

  // return all matching documents sorted is ascending order by title
  var sortKey = req.query.sort;
  var theUser = UserController.getCurrentUser();

  return Item.find({user: theUser.username}).sort(sortKey).exec(function (err, items) {

    if(!err) {
      res.render('userProfile', {
        greeting: "Your list of items to sell",
        username: UserController.getCurrentUser().username,
        items: items
      });
    } else {
      return console.error(err);
    }
  });
});

router.delete('/', function(req, res) {

  Item.find({ _id: req.body.item_id })
      .remove(function (err, item) {
        if(err) {
          res.render("error", {
            error: {
              status: 500,
              stack: JSON.stringify(err.errors)
            },
            message: "You failed!"
          })
          console.log(err);
        } else {
          console.log("Item has been deleted.");
          return;
          }
      });
});

// on submit of form on index page (save an item to sell)
router.post('/', function(req, res) {

  if (req.body._id) { // item already had an _id, so it needs to be updated

    Item.findOne({ _id: req.body._id}, function(err, item) {
      if (err) {
        console.log(err);
      } else {
        // once it is found, update it
        var theUser = UserController.getCurrentUser();
        item.title = req.body.title;
        item.image = req.body.image;
        item.price = req.body.price;
        item.endDate = req.body.endDate;
        item.user = theUser.username;

        item.save(function(err, updateItem) {
          if (err) {
            console.log(err)
          } else {
            res.redirect('index');
          }
        });
      }
    });
  }
  else {
    // do initial save
    //console.log(req.body);
    var theUser = UserController.getCurrentUser();
    //console.log(theUser);

    new Item({
      title: req.body.title,
      image: req.body.image,
      price: req.body.price,
      endDate: req.body.endDate,
      user: theUser.username
    }).save(function (err, item) {
      if(err) {
        res.render("error", {
          error: {
            status: 500,
            stack: JSON.stringify(err.errors)
          },
          message: "You failed!"
        })
        console.log(err);
      } else {
        console.log("item saved successfully");
        // console.log(req.body.review);
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
      }
    });
  }
});

module.exports = router;
