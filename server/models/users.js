const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    user_id: String,
    messages: [{
        id: String,
        timestamp: String
    }]
});

const userSchema = new Schema({
    id: String,
    name: String,
    photo: String,
    email: String,
    chats: [{ type: Schema.Types.ObjectId, ref:'Chat' }]
});

const User = mongoose.model('User', userSchema);
const Chat = mongoose.model('Chat', chatSchema);

exports.User = User;
exports.Chat = Chat;
