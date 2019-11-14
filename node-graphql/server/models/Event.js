var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  id: String,
  image: String,
  title: String,
  titleshort: String,
  description: String,
  place: String
});

module.exports = mongoose.model('Event', EventSchema);
