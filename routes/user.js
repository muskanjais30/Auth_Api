const express = require('express');
const userController = require('../controllers/user.controller');
// const ControllerNew = require('../controllers/controllerNew');
const emailVerificationController = require('../controllers/emailVerificationController');

const router = express.Router();

router.post('/signup-Student', userController.signUpStudent);
router.post('/signup-Club', userController.signUpClub);
router.use('/verify-email', emailVerificationController);
router.post('/login-Club', userController.loginClub);
router.post('/login-Student', userController.loginStudent);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
// router.post('/new',ControllerNew.uploadProduct );

module.exports = router;