var mongoose = require('mongoose');
var itemSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: String,
  price: Number,
  endDate: Date,
  user: {
    type: String,
    required: true
  }
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item;
