const { Message } = require('../models/Messages');

class Chat {
    static chat_event(client, io) {
        client.on("chat", (response) => {
            const sender = response.interlocutor;
            const message = response.message;
            const receiver = response.message.id;

            const data = new Message({
                sender_id: sender,
                receiver_id: receiver,
                message: message,
                timestamp: Date.now().toString()
            })

            io.emit(sender, data);
        });
    }

    static typing_event(client, io) {
        client.on('typing', (response) => {
           io.emit('typing', response);
        });
    }
}

module.exports = Chat;