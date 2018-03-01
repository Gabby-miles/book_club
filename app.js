var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session')
var MongoStore = require('connect-mongo')(session); //having session as an argument lets the connect Mongo middleware access the sessions. 
var app = express();

//mongodb connection, bookworm is the name of the database, it can be anything I want it named 
mongoose.connect("mongodb://localhost:27017/bookworm");
var db = mongoose.connection;
//mongo error
db.on('error', console.error.bind(console, "connection error:"));

//use sessions for tracking logins
app.use(session({
	secret: "treehouse loves you",
	resave: true,
	saveUninitialized: false,
	store: new MongoStore({
		mongooseConnection: db
	})
}));

//make user ID available in templates.
//"locals" provides a way to add info. to the response object. In Express all of my views have access to the response's locals object.
app.use(function (req, res, next) {
	res.locals.currentUser = req.session.userId;
	next();

});

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

// include routes
var routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
