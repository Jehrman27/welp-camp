const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

// route for registration form
router.get('/register', (req, res) => {
    res.render('users/register');
});

// route for submitting new user registration
router.post('/register', catchAsync(async (req, res) => {
    try {
    // destructure user data from request body
    const { email, username, password } = req.body;

    // create new user with the email and username provided
    const user = new User({email, username});

    // hash and save password to the user
    const regsiteredUser = await User.register(user, password);
    req.flash('success', 'Welcome to Welp Camp');
    res.redirect('/campgrounds');
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { 
    failureFlash: true, 
    failureRedirect: '/login'
    }), (req, res) => {
    req.flash('success', 'Welcome back!');
    res.redirect('/campgrounds');
})

router.get('/logout', (req, res, next) => {
    if(!req.isAuthenticated()){
        return res.redirect('/campgrounds');
    } else {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out.');
        res.redirect('/campgrounds');
    });
}
})

module.exports = router;