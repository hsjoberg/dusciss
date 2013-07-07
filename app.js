// Discuss dusciss

// Global libs:
mongoose = require('mongoose');

var express = require('express')
, http = require('http')
, path = require('path')

, feed = require('./routes/feed');

// Initialize
var app = express();
mongoose.connect('mongodb://localhost/database');

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// General error handling:
app.use(function(error, request, response, next){
	// Our simple error handling will accept String, otherwise continue to send the error to the error handler of express,
	// as the error should then be a bug.
	if(Object.prototype.toString.call(error) !== '[object String]') {
		next(error);
	}
	else {
		console.log("Dusciss error: " + error);

		response.status(500);
		response.render('error', {
			appTitle : 'Dusciss',
			errorMessage : error
		});
	}
});

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

// Get the feed
app.get('/', feed.showFeed);
app.get('/feed/:board', feed.showFeed)

// New thread:
app.get('/create-thread', feed.showCreateThread);
app.get('/create-thread/:board', feed.showCreateThread);
app.post('/create-thread', feed.createThread);

app.get('/error', function(request, response, next) {
	next('This is the error page');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
