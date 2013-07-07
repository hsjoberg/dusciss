// http://howtonode.org/express-mongodb

// MongoDB Driver:

var feedCounter = 1;

FeedProvider = function(host, port) {
  this.db= new Db('node-mongo-blog', new Server(host, port, {auto_reconnect: true}, {}));
  this.db.open(function(){});

};

FeedProvider.prototype.dummyData = [];

FeedProvider.prototype.findAll = function(callback) {
  callback( null, this.dummyData )
};

FeedProvider.prototype.findById = function(id, callback) {
  var result = null;
  for(var i =0;i<this.dummyData.length;i++) {
    if( this.dummyData[i]._id == id ) {
      result = this.dummyData[i];
      break;
    }
  }
  callback(null, result);
};

FeedProvider.prototype.save = function(feeds, callback) {
  var feed = null;

  if( typeof(feeds.length)=="undefined")
    feeds = [feeds];

  for( var i =0;i< feeds.length;i++ ) {
    feed = feeds[i];
    feed._id = feedCounter++;
    feed.date = new Date();

    if( feed.posts === undefined )
      feed.posts = [];

    for(var j =0;j< feed.posts.length; j++) {
      feed.posts[j].date = new Date();
    }
    this.dummyData[this.dummyData.length]= feed;
  }
  callback(null, feeds);
};

/* Lets bootstrap with dummy data */
new FeedProvider().save([
  {title: 'Post one', body: 'Body one', posts:[{text:'I love it'}, {comment:'This is rubbish!'}]},
  {title: 'Post two', body: 'Body two'},
  {title: 'Post three', body: 'Body three'}
], function(error, feeds){});

exports.FeedProvider = FeedProvider;