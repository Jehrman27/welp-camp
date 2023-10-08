const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');
const {storeReturnTo} = require('../middleware');

// registration form and create new user
router.route('/register')
.get(users.renderRegister)
.post(catchAsync(users.register));

// login form and login
router.route('/login')
.get(users.renderLogin)
.post(storeReturnTo, passport.authenticate('local', { 
    failureFlash: true, 
    failureRedirect: '/login'
    }), users.login);

// logout current user
router.get('/logout', users.logout)

module.exports = router;