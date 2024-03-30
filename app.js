const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());

require("./config/database").connect();


app.use("/user", userRoute);

module.exports = app;

