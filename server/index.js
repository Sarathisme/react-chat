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

app.post('/chat/users', (req, res) => {
    User.findOne({id: req.body.id}, (err, user) => {
        res.status(200).send({"chats": user.chats});
    });
});

app.post('/chat/user', (req, res) => {
    const interlocutor = req.body.interlocuter;
    const interpolator = req.body.id;

    User.find({id: interpolator}, (err, user) => {
        if (user.chats === undefined) {
            new Promise(function(resolve, reject) {
                    User.findOne({id: interlocutor}, (err, data) => {
                        let chat = {};
                        chat["user_id"] = data.id;
                        chat["name"] = data.name;
                        chat["photo"] = data.photo;
                        chat["messages"] = [];

                        resolve(chat);
                    });
                }
            ).then(data => {
                res.send({"user": data});
                // console.log(data);
                // User.updateOne({id: interpolator}, {$push: {chats: data}}, (err, user) => {
                //     res.send({"message": "success", "exists": "false"});
                // });
            });
        } else {

        }
    });
});

mongoose.connect(DATABASE_URI, { useNewUrlParser: true }).then((value => {
    app.listen(PORT, debug=true);
}));
