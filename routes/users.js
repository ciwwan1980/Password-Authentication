const express = require('express');
const router = express.Router();
const passport = require('passport');
const crypto = require('crypto');
const async = require('async');
const nodemailer = require('nodemailer');


//Requiring user model
const User = require('../models/usermodel');

// Checks if user is authenticated
function isAuthenticatedUser(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'Please Login first to access this page.')
    res.redirect('/login');
}

//Get routes
router.get('/login', (req,res)=> {
    res.render('login');
});

router.get('/signup', (req,res)=> {
    res.render('signup');
});

router.get('/dashboard', isAuthenticatedUser, (req,res)=> {
    res.render('dashboard');
});

router.get('/logout', (req, res)=> {
    req.logOut();
    req.flash('success_msg', 'You have been logged out successfully.');
    res.redirect('/login');
});

router.get('/forgot', (req, res)=> {
    res.render('forgot');
});

router.post('/signup', (req, res)=> {
    let {name, email, password} = req.body;

    let userData = {
        name : name,
        email :email
    };


    User.register(userData, password, (err, user)=> {
        if(err) {
            req.flash('error_msg', 'ERROR: '+err);
            res.redirect('/login');
        }
        passport.authenticate('local') (req, res, ()=> {
            req.flash('success_msg', 'Account created successfully');
            res.redirect('/login');
        });
    })
    });;



    //POST routes
router.post('/login', passport.authenticate('local', {
    successRedirect : '/dashboard',
    failureRedirect : '/login',
    failureFlash: 'Invalid email or password. Try Again!!!'
}));


// Routes to handle forgot password
router.post('/forgot', (req, res, next)=> {
    let recoveryPassword = '';
      async.waterfall([
             (done) => {
            crypto.randomBytes(20, (err , buf) => {
                let token = buf.toString('hex');
                done(err, token);
            })
             },

             (token,done)=>{
                User.findOne({email : req.body.email})
                    .then(user => {
                    if(!user) {
                        req.flash('error_msg', 'User does not exist with this email.');
                        return res.redirect('/forgot');
                    }
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 1800000; //   half hours

                    user.save(err => {
                        done(err, token, user);
                    });
                })
                 .catch(err => {
                    req.flash('error_msg', 'ERROR: '+err);
                    res.redirect('/forgot');
                })
                
                }
      ], err=>{
          if (err) res.redirect("/forgot")
      })
        }),
module.exports = router;