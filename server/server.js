const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const {PORT, DATABASE_URI} =  require('./config');

const { User } = require('./models/Users');

const Dashboard = require('./controller/Dashboard');
const Chat = require('./controller/Chat');
const Event = require('./events/Chat');

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(cors());
app.use(body_parser.json({extended: true}));

app.get('/', (req, res) => {
    res.send("Hey!");
});

app.post('/user', (req, res) => {
    Dashboard.get_user(req.body.id).then(data => {
        console.log(req.body);
       res.status(200).send(data);
    });
});

app.post('/add/user', (req, res) => {
    Dashboard.add_user(new User({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
    })).then(data => {
        res.status(200).send(data);
    });
});

app.post('/get/users', (req, res) => {
    Dashboard.get_users(req.body.id, req.body.query).then(data => {
        res.status(200).send(data)
    });
});

app.post('/chat/get/users', (req, res) => {
    User.findOne({id: req.body.id}, (err, user) => {
        res.status(200).send({"chats": user.chats});
    });
});

app.post('/chat/get/user', (req, res) => {
    Chat.get_user(req.body.interlocutor).then(data => {
        res.send(data);
    });
});

app.post('/chat/get/messages', (req, res) => {
    Chat.get_messages(req.body.interlocutor, req.body.id).then(data => {
       res.send(data);
    });
});

app.post('/chat/post/messages', (req, res) => {
    Chat.post_messages(req.body.interlocutor, req.body.id, req.body.message).then(data => {
        res.send(data);
    });
});

io.on("connection", async (client) => {
    Event.chat_event(client, io);
    Event.typing_event(client, io);
});

mongoose.connect(DATABASE_URI, { useNewUrlParser: true }).then((value) => {
    server.listen(PORT, debug=true);
});
