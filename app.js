const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoute = require('./routes/user');
const cors = require("cors")

require('dotenv').config();

const app = express();

// app.use(cors());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
app.use(express.json());
app.use(bodyParser.json());

require("./config/database").connect();


app.use("/user", userRoute);

module.exports = app;

