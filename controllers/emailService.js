require('dotenv').config();

const nodemailer = require('nodemailer');
const crypto = require('crypto');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "muskj12345@gmail.com",
        pass: "pajnwwmlbtvtrrtg",
    },
});

const generateVerificationCode = () => {
    return crypto.randomBytes(16).toString('hex');
};

function sendVerificationEmail(email, verificationCode) {
    // Email content
    const mailOptions = {
        from: "muskj12345@gmail.com",
        to: email,
        subject: "Account Verification",
        html: `<p>Thank you for registering! Click the following link to verify your account:</p>
               <a href="http://localhost:5000/verify-account?code=${verificationCode}">Verify Account</a>`,
        //replace the link with the link of the page where you wish to redirect
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Verification email sent: ' + info.response);
        }
    });
};

// Function to send the reset email
function sendResetEmail(email, resetToken) {
    // Email content
    const mailOptions = {
        from: "muskj12345@gmail.com",
        to: email,
        subject: "Password Reset",
        html: `<p>You have requested a password reset. Click the following link to reset your password:</p>
               <a href="https://yourdomain.com/reset-password?token=${resetToken}">Reset Password</a> <p>Token:${resetToken}</p>`,
        //replace the link with the reset password pafe, this is dummy link
        //have also shown the token in the mail, for ease of testing on postman.
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};


module.exports = {
    sendResetEmail: sendResetEmail,
    sendVerificationEmail: sendVerificationEmail,
    generateVerificationCode: generateVerificationCode,
};
