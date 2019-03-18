const { User } = require('../models/Users');

class Chat {
    static get_user(interlocutor) {
        return new Promise(function (resolve) {
            User.find({id: interlocutor}, (err, user) => {
                new Promise(function(resolve, reject) {
                        User.findOne({id: interlocutor}, (err, data) => {
                            let chat = {};
                            console.log(interlocutor);
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

    static get_messages(interlocutor, interpolator) {
        return new Promise((resolve => {
            User.findOne({id: interpolator}).where("chats.user_id").equals(interlocutor).select("chats.$.user_id").exec((err, data) => {
                if(data === null) {
                    resolve({"data": []})
                } else {
                    resolve({"data": data.chats[0].messages})
                }
            });
        }))
    }

    static post_messages(interlocutor, interpolator, message) {
        return new Promise(resolve => {
            User.findOne({id: interpolator}).where("chats.user_id").equals(interlocutor).exec((err, user) => {
                if(user === null) {
                    new Promise(function(resolve, reject) {
                            User.findOne({id: interlocutor}, (err, data) => {
                                let chat = {};
                                chat["user_id"] = data.id;
                                chat["name"] = data.name;
                                chat["photo"] = data.photo;
                                chat["messages"] = [];

                                chat['messages'].push(message);

                                resolve(chat);
                            });
                        }
                    ).then(chat => {
                        User.findOneAndUpdate({id: interpolator}, {$push: {chats: chat}}, (err, user) => {
                            if(err) {
                                throw err;
                            } else {
                                resolve({"message": "success"});
                            }
                        });
                    });
                } else {
                    User.update({id: interpolator, 'chats.user_id': interlocutor }, {$push: {'chats.$.messages': message}}, (err, user) => {
                            if(err) {
                                throw err;
                            } else {
                                resolve({"message": "success"});
                            }
                        }
                    );
                }
            });
        });
    }
}

module.exports = Chat;