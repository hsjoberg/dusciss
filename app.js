// Discuss dusciss

// Global libs:
mongoose = require('mongoose');

var express = require('express')
, http = require('http')
, path = require('path')
, stylus = require('stylus')
, feed = require('./routes/feed');

// Initialize
var app = express();
mongoose.connect('mongodb://localhost/dusciss');

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
app.use(stylus.middleware({
	src : __dirname + '/public',
	compile : function(str, path) {
		 return stylus(str).set('filename', path).set('compress', 'production' == app.get('env'));
	}
}));
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

// Create thread or post
app.post('/new-post', feed.newPost);
app.post('/new-post/:thread_id', feed.newPost);

app.get('/error', function(request, response, next) {
	next('This is the error page');
});


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
