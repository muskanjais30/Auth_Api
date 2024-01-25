const express = require('express');
const bodyParser = require('body-parser');

const userRoute = require('./routes/user');

const app = express();

app.use(bodyParser.json());

// const postRoute = require('./routes/posts');
// app.use('/posts', postRoute);

app.use("/user", userRoute);

module.exports = app;