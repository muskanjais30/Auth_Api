const mongoose = require("mongoose");
require('dotenv').config();

exports.connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,   
        useUnifiedTopology: true 
    })
    .then(() => {
        console.log("Database Connected");
    })
    .catch((err) => {
        console.log("Database Connection issues");
        console.error(err);
        process.exit(1);
    });
};
