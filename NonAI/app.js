var createError = require('http-errors');
var express = require('express');
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var logger = require('morgan');

var SQLiteStore = require('connect-sqlite3')(session);

var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({db:'sessions.db',dir:'./var/db'})
}));
app.use(passport.authenticate('session'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use('/',indexRouter);
app.use('/',authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

/*app.listen(port,'192.168.0.95',() => {
    console.log(`Running on port ${port}...`);
});*/





module.exports = app;