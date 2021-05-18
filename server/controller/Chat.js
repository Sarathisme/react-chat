const { User } = require('../models/Users');
const { Message } = require("../models/Messages")

class Chat {
    static get_user(interlocutor) {
        return new Promise(function (resolve) {
            User.find({id: interlocutor}, (err, user) => {
                new Promise(function(resolve, reject) {
                        User.findOne({id: interlocutor}, (err, data) => {
                            let chat = {};
                            chat["user_id"] = data.id;
                            chat["name"] = data.name;
                            chat["photo"] = data.photo;

                            resolve(chat);
                        });
                    }
                ).then(data => {
                    resolve({"user": data});
                });
            });
        })
    }

    static get_messages(receiverID, senderID) {
        return new Promise(resolve => {
            Message.find({ $or: [{'sender_id': senderID, 'receiver_id': receiverID}] })
                .exec((err, data) => {
                    if(data) {
                        resolve({"data": data})
                    } else {
                        resolve({"data": []})
                    }
                });
        })
    }

    static post_messages(senderID, receiverID, message, timestamp) {
        return new Promise(resolve => {
            const messageObject = new Message({
                sender_id: senderID,
                receiver_id: receiverID,
                message: message,
                timestamp: timestamp
            });

            messageObject.save().then((data) => {
                try {
                    if (data) {
                        User.updateOne(
                            {id: senderID},
                            {$push: {chats: receiverID}},
                            (err, data) => {
                                resolve({"data": data});
                            })
                    }
                } catch (e) {
                    console.log("eRRROR!", e)
                }
            })
        });
    }
}

module.exports = Chat;