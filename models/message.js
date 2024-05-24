const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: Number,
    sender: String,
    receiver: String,
    content: String,
    time: String,
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
