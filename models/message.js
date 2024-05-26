const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    id: Number,
    sender: String,
    receiver: String,
    content: String,
    time: String,
    date: String,
    img: String,
    image:Buffer
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
