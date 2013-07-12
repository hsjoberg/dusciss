// Discuss dusciss

// Global libs:
mongoose = require('mongoose');

var express = require('express')
, http = require('http')
, path = require('path')
, stylus = require('stylus')
, image = require('./routes/image')
, feed = require('./routes/feed')
, DuscissError = require('./modules/ErrorHandler');


// Initialize
var app = express();

mongoose.connect('mongodb://localhost/dusciss');
mongoose.connection.on('connected', function() {
	console.log('Connection to MongoDB server established.');
});

// all environments
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.logger('dev'));
app.use(express.bodyParser({
	uploadDir: './temp/client_uploads' // POST file uploads will be uploaded to this folder.
}));
app.use(express.cookieParser('dusciss'));
app.use(express.session());
app.use(app.router);
app.use(stylus.middleware({
	src : __dirname + '/public',
	compile : function(str, path) {
		 return stylus(str).set('filename', path).set('compress', 'production' == app.get('env'));
	}
}));
app.use(express.static(path.join(__dirname, 'public')));

// 404:
app.use(function(request, response, next){
	response.status(404);
	next(new Error("The requested page could not be found."));
});

// At last, the general error handler:
app.use(DuscissError.errorHandler);

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
	response.status(200);
	next(new Error('This is the error page'));
});

app.get('/i/:id', image.showImage);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
