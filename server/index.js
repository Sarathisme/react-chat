const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const { User } = require('./models/users');

const PORT = 9000;
const DATABASE_URI = "mongodb://root:AIzaSyDc613XSx9_lZTv7qNFCxEhwiRHRXYmCNE@ds135540.mlab.com:35540/chat";

const app = express();

app.use(cors());
app.use(body_parser.json({extended: true}));

app.post('/user', (req, res) => {
    User.findOne({id: req.body.id}, (err, user) => {
        if(err) {
            throw err;
        } else {
            res.status(200).send({
                "photo": user.photo,
                "name": user.name
            });
        }
    });
});

app.post('/add/user', (req, res) => {
    let newUser = new User({
        id: req.body.id,
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
    });

    User.findOne({id: req.body.id}, (err, user) => {
        if(err) {
            throw err;
        } else {
            if (user !== null) {
                res.status(200).send({"message": "success"});
            } else {
                newUser.save(function (err) {
                    if (err) {
                        throw err;
                    } else {
                        res.status(200).send({"message": "success"});
                    }
                });
            }
        }
    });
});

app.post('/get/users', (req, res) => {
    let queryCond = {};

    const query = req.body.query;

    if(query){
        queryCond.name={$regex:query,$options:"i", };
    }

    if(query !== '') {
        User.find({ $and: [{ name: { '$regex': req.body.query, '$options': 'i' } }, { id: { $ne: req.body.id } } ]}, (err, users) => {
            res.status(200).send({"results": users});
        });
    } else {
        res.status(200).send({"results": []})
    }
});

app.post('/chat/get/users', (req, res) => {
    User.findOne({id: req.body.id}, (err, user) => {
        res.status(200).send({"chats": user.chats});
    });
});

app.post('/chat/get/user', (req, res) => {
    const interlocutor = req.body.interlocuter;
    const interpolator = req.body.id;

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
            res.send({"user": data});
        });
    });
});

app.post('/chat/get/messages', (req, res) => {
    const interlocuter = req.body.interlocuter;
    const interpolator = req.body.id;

    User.find({id: interpolator, chats: {user_id: interlocuter}}, (err, data) => {
        console.log(data);
        if(data === undefined) {
            res.send({"data": []})
        } else {
            res.send({"data": data.messages})
        }
    });
});

app.post('/chat/post/messages', (req, res) => {
    const interlocuter = req.body.interlocuter;
    const interpolator = req.body.id;
    const message = req.body.message;

    User.findOne({id: interpolator, chats: {user_id : interlocuter}}, (err, user) => {
        if(user === null) {
            new Promise(function(resolve, reject) {
                    User.findOne({id: interlocuter}, (err, data) => {
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
                    res.send({"message": "success"});
                });
            });
        }
    });
});

mongoose.connect(DATABASE_URI, { useNewUrlParser: true }).then((value => {
    app.listen(PORT, debug=true);
}));
