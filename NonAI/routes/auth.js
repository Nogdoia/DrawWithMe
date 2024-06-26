var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');
var db = require('../db');
var router = express.Router();

passport.use(new LocalStrategy(function verify(username,password,cb) {
    db.get('SELECT * from users WHERE username = ?',[username],function(err,row) {
        if (err) {return cb(err);}
        if (!row) {return cb(null,false,{message:'Incorrect username or password.'});}

        crypto.pbkdf2(password,row.salt,310000,32,'sha256',function(err,hashedPassword) {
            if (err) {return cb(err);}
            if (!crypto.timingSafeEqual(row.hashed_password,hashedPassword)) {
                return cb(null,false,{message:'Incorrect username or password.'});
            }
            return cb(null,row);
        });
    });
}));

passport.serializeUser((user,cb) => {
    process.nextTick(() => {
        cb(null, {id: user.id, username: user.username});
    });
});
passport.deserializeUser((user,cb) => {
    process.nextTick(() => {
        return cb(null,user);
    });
});


router.get('/login',(req,res,next) => {
    res.render('login');
});
router.post('/login/password',passport.authenticate('local',{
    successRedirect: '/',
    failureRedirect: '/login'
}));
router.post('/logout',(req,res,next) => {
    req.logout((err) => {
        if (err) {return next(err);}
        res.redirect('/');
    });
});





module.exports = router;