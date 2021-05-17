const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messagesSchema = new Schema({
    sender_id: String,
    receiver_id: String,
    message: String,
    timestamp: String
});

const Message = mongoose.model('Message', messagesSchema);

exports.Message = Message;
