// models/OnlineUser.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Seen = new Schema({
  user: String,
  time: String,
  date:String
});

module.exports = mongoose.model('Seen', Seen);
