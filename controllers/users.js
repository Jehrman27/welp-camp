const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
    // destructure user data from request body
    const { email, username, password } = req.body;

    // create new user with the email and username provided
    const user = new User({email, username});

    // hash and save password to the user
    const regsiteredUser = await User.register(user, password);

    // login new user in this session
    req.login(regsiteredUser, err => {
        if(err) return next(err);
        req.flash('success', 'Welcome to Welp Camp');
        res.redirect('/campgrounds');
    });
    
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    if(!req.user){
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
}