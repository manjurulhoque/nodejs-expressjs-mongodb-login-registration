var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');

var User = require('../models/user');

router.get('/test', (req, res, next) => {
    res.render('index');
});

router.get('/login', (req, res, next) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    // find user by email
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                res.redirect('/login');
            }
            // check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        req.user = user;
                        res.locals.user = user;
                        console.log(res.locals.user);
                        res.redirect('/');
                    } else {
                        res.redirect('/login');
                    }
                })
        })
});

// get signup page
router.get('/signup', (req, res, next) => {
    res.render('signup');
});

// post request for signing up user
router.post('/signup', (req, res, next) => {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if(user) {

            }else {
                const newUser = new User({
                    username, email, password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.redirect('/login'))
                            .catch(err => console.log(err))
                    });
                });
            }
        })
});

module.exports = router;