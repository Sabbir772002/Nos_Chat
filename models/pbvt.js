// models/pbvt.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pbvt = new Schema({
  fnd1: String,
  fnd2: String,
  e: String,
  d: String,
  n: String,
});

module.exports = mongoose.model('pbvt', pbvt);
