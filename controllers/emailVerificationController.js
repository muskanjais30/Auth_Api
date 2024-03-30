require('dotenv').config();

const express = require('express');
// const models = require('../models');
const userModel = require('../models/users');

const router = express.Router();

router.get('/', (req, res) => {
    const verificationCode = req.query.code;

    userModel.Users.findOne({ where: { verificationCode: verificationCode } }).then(user => {
        if (!user) {
            return res.status(400).json({ message: "Invalid verification code" });
        }

        // Check if the user is already verified
        if (user.isVerified) {
            return res.status(400).json({ message: "Email already verified" });
        }

        // Mark the user as verified and remove the verification code
        user.update({ isVerified: true, verificationCode: null }).then(() => {
            res.status(200).json({ message: "Email verification successful" });
        }).catch(error => {
            res.status(500).json({ message: "Something went wrong", error: error });
        });
    }).catch(error => {
        res.status(500).json({ message: "Something went wrong", error: error });
    });
});

module.exports = router;
