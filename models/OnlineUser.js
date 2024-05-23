// models/OnlineUser.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OnlineUserSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('OnlineUser', OnlineUserSchema);
