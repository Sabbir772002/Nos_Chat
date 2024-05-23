
// models/ChatRoom.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatRoomSchema = new Schema({
  roomId: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
