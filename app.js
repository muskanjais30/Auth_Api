const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const cors = require("cors")

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

require("./config/database").connect();


app.use("/user", userRoute);

module.exports = app;

