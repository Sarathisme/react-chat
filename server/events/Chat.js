const { User } = require('../models/Users');

class Chat {
    static chat_event(client, io) {
        client.on("chat", (response) => {
            const interpolator = response.interlocutor;
            const message = response.message;
            const interlocutor = response.message.id;


            User.findOne({id: interpolator}).where("chats.user_id").equals(interlocutor).exec((err, user) => {
                if (user === null) {
                    new Promise(function (resolve, reject) {
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
                            if (err) {
                                throw err;
                            } else {
                                io.emit(interpolator, message);
                            }
                        });
                    });
                } else {
                    User.update({
                        id: interpolator,
                        'chats.user_id': interlocutor
                    }, {$push: {'chats.$.messages': message}}, (err, user) => {
                        if (err) {
                            throw err;
                        } else {
                            io.emit(interpolator, message);
                        }
                    });
                }
            });
        });
    }

    static typing_event(client, io) {
        client.on('typing', (response) => {
            console.log(response);
           io.emit('typing', response);
        });
    }
}

module.exports = Chat;