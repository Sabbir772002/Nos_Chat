// models/OnlineUser.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OnlineUser = new Schema({
  user: String
});

module.exports = mongoose.model('OnlineUser', OnlineUser);
