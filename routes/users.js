const express = require('express');
const router = express.Router();
const passport = require('passport');



//Requiring user model
const User = require('../models/usermodel');

//Get routes
router.get('/login', (req,res)=> {
    res.render('login');
});

router.get('/signup', (req,res)=> {
    res.render('signup');
});

router.get('/dashboard', (req,res)=> {
    res.render('dashboard');
});




module.exports = router;