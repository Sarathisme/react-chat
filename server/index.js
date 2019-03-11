const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const { User, Chat } = require('./models/users');

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

    newUser.save(function (err) {
        if(err) {
            throw err;
        } else {
            res.status(200).send({"message": "success"});
        }
    });
});

app.post('/chat/users', (req, res) => {
   User.findOne({id: req.body.id}, (err, user) => {
       console.log(user);
     res.status(200).send({"chats": user.chats});
   });
});


mongoose.connect(DATABASE_URI, { useNewUrlParser: true }).then((value => {
    app.listen(PORT, debug=true);
}));
