const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: String,
    name: String,
    photo: String,
    email: String,
    chats: [{
        user_id: String,
        name: String,
        messages: [{
            id: String,
            message: String,
            timestamp: String
        }]
    }]
});

const User = mongoose.model('User', userSchema);

exports.User = User;
