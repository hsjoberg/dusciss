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

// development only
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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
