const express = require('express');
const body_parser = require('body-parser');
const mongoose = require('mongoose');

const { User, Chat } = require('./models/users');


const PORT = 9000;
const DATABASE_URI = "mongodb://root:AIzaSyDc613XSx9_lZTv7qNFCxEhwiRHRXYmCNE@ds135540.mlab.com:35540/chat";

const app = express();
app.use(body_parser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.json({data: "Hello, world!"});
});

mongoose.connect(DATABASE_URI, { useNewUrlParser: true }).then((value => {
    app.listen(PORT, debug=true);
}));
