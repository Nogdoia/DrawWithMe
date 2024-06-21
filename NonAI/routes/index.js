var express = require('express');
var db = require('../db');

function fetchCanvases(req, res, next) {
  db.all('SELECT * FROM canvases WHERE owner_id = ?', [
    req.user.id
  ], function(err, rows) {
    if (err) { return next(err); }
    
    var canvases = rows.map(function(row) {
      return {
        id: row.id,
        title: row.title,
        url: '/' + row.id
      }
    });
    res.locals.canvases = canvases;
    next();
  });
}


var router = express.Router();

router.get('/', (req,res,next) => {
    if (!req.user) {return res.render('home');}
    next();
}, fetchCanvases, (req,res,next) => {
    res.locals.filter = null;
    res.render('index',{user: req.user});
});









module.exports = router;