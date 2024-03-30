require('dotenv').config();

// const models = require('../models');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const moment = require('moment');
const emailService = require('./emailService');
const emailVerificationController = require('./emailVerificationController');
const userModel = require('../models/users');
const passResetModel = require('../models/passwordreset');
const clubModel = require('../models/clubs');
const { generateVerificationCode } = require('./emailService');


//for student sign-up 
function signUpStudent(req, res) {

    userModel.findOne({ where: { email: req.body.email } }).then(result => {
        if (result) {
            res.status(409).json({
                message: "Email already exists",
            })
        } else {
            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(req.body.password, salt, function (err, hash) {
                    const user = {
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        password: hash
                    }
                    
                    const verificationCode = generateVerificationCode();
                    emailService.sendVerificationEmail(user.email, verificationCode);

                    // Save verification code in the database
                    userModel.create({
                        ...user,
                        verificationCode: verificationCode
                    }).then(result => {
                        // Send verification email
                        res.status(200).json({
                            message: "User created successfully. Check your email for verification.",
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong",
                            error: error
                        });
                    });
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
        })
    });
}


// signup for club
function signUpClub(req, res) {

    clubModel.findOne({ where: { clubName: req.body.clubName } }).then(result => {
        if (result) {
            res.status(409).json({
                message: "Club already exists",
            })
        } else {
            bcryptjs.genSalt(10, function (err, salt) {
                bcryptjs.hash(req.body.password, salt, function (err, hash) {
                    const club = {
                        clubName: req.body.clubName,
                        collegeUni: req.body.collegeUni,
                        email: req.body.email,
                        city: req.body.city,
                        password: hash
                    }
                    
                    const verificationCode = generateVerificationCode();
                    emailService.sendVerificationEmail(club.email, verificationCode);

                    // Save verification code in the database
                    clubModel.create({
                        ...club,
                        verificationCode: verificationCode
                    }).then(result => {
                        // Send verification email
                        res.status(200).json({
                            message: "User created successfully. Check your email for verification.",
                        });
                    }).catch(error => {
                        res.status(500).json({
                            message: "Something went wrong",
                            error: error
                        });
                    });
                });
            });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Something went wrong",
        })
    });
}



// for student login
async function loginStudent(req, res) {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const result = await bcryptjs.compare(req.body.password, user.password);

        if (result) {
            const token = jwt.sign({
                email: user.email,
                userId: user.id
            }, process.env.JWT_KEY);
            
            //updating token in database
            await userModel.updateOne({ email: req.body.email }, { token: token });
           
            res.status(200).json({
                message: "Authentication successful",
                token: token
            });
            
            //res.setHeader('Authorization', 'Bearer ' + token); --> to be done when calling req apis (token for user auth)
        } else {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}


// for club login
async function loginClub(req, res) {
    try {
        const club = await clubModel.findOne({ email: req.body.email });

        if (!club) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const result = await bcryptjs.compare(req.body.password, club.password);

        if (result) {
            const token = jwt.sign({
                email: club.email,
                clubId: club.id
            }, process.env.JWT_KEY);
            
            //updating token in database
            await clubModel.updateOne({ email: req.body.email }, { token: token });
           
            res.status(200).json({
                message: "Authentication successful",
                token: token
            });
            
            //res.setHeader('Authorization', 'Bearer ' + token); --> to be done when calling req apis (token for user auth)
        } else {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong",
            error: error
        });
    }
}



//for forgot password
function forgotPassword(req, res) {
    const email = req.body.email;

    // Generate a unique reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save the reset token in the PasswordReset model
    passResetModel.create({
        email: email,
        token: resetToken
    }).then(() => {
        // Send an email to the user with the reset token
        emailService.sendResetEmail(email, resetToken);
        res.status(200).json({ message: "Reset token sent to your email" });
    }).catch(error => {
        res.status(500).json({ message: "Something went wrong", error: error });
    });
};



//for password reset
function resetPassword(req, res) {
    const { resetToken, newPassword } = req.body;

    passResetModel.findOne(
        { token: resetToken },
    ).then(passwordReset => {
        if (!passwordReset) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }

        // Check if the token has expired
        const tokenExpiration = moment(passwordReset.createdAt).add(1, 'hour'); // Assuming 1 hour validity 
        if (moment().isAfter(tokenExpiration)) {
            // Token has expired
            passwordReset.deleteOne(); // Remove the expired token from the database
            return res.status(400).json({ message: "Reset token has expired" });
        }

        // Find the user by email using the email stored in PasswordReset
        userModel.findOne({ email: passwordReset.email }).then(user => {
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }

            // Update the user's password
            bcryptjs.hash(newPassword, 10, function (err, hash) {
                user.password = hash; // Update the password field

                user.save().then(() => {
                    // Remove the used reset token
                    passwordReset.deleteOne();

                    res.status(200).json({ message: "Password reset successful" });
                }).catch(error => {
                    res.status(500).json({ message: "Something went wrong", error: error });
                });
            });
        }).catch(error => {
            res.status(500).json({ message: "Something went wrong", error: error });
        });
    }).catch(error => {
        res.status(500).json({ message: "Something went wrong", error: error });
    });
}

module.exports = {
    signUpStudent: signUpStudent,
    signUpClub: signUpClub,
    loginStudent: loginStudent,
    loginClub: loginClub,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword
}