/*
	Methods in this module:
	-	[GET]	showFeed(request, response)
					Shows the feed or a specific board.
	-	[GET]	showCreateFeed(request, response)
					Shows the page to create a new thread.
	-	[POST]	newPost()
					Handles requests for new board posts
*/
var fs = require('fs');
var Thread = require('../models/ThreadModel');

exports.showFeed = function(request, response, next) {
	var mainFeed = true;
	var board = "Main Feed";

	var searchForThreads = Thread.find();

	if('board' in request.params) { // alternative method request.params.hasOwnProperty('feed')
		board = request.params.board;
		searchForThreads.where('board').equals(board.toLowerCase());
		mainFeed = false; // As we're getting a specific board
	}

	searchForThreads.exec(function(error, threads) {
		if(error) return next(error);

		response.render('feed', {
			appTitle: 'Dusciss', // Yeah should always be "Duscuss I guess... whatever
			feed : {
				boardName : board,
				mainFeed : mainFeed,

				threads: threads.reverse() // Show newest first by reverse()-ing
			}
		});
	});
};

exports.showCreateThread = function(request, response) {
	response.render('make_thread', {
		appTitle : 'Dusciss',

		selectedBoard : ('board' in request.params) ? request.params.board : null
	});
}

exports.newPost = function(request, response, next) {
	// Check if an image was uploaded:
	var imageIsUploaded = false;
	var imgFileId = null; // This is the value that get stored in the document.
	if(request.files && request.files.img && request.files.img.size > 0) {
		var imageIsUploaded = true;
		//	With help from:
		//		https://github.com/mongodb/node-mongodb-native/blob/master/docs/gridfs.md
		//		http://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle2.html
		imgFileId = new mongoose.mongo.ObjectID();
		var gs = mongoose.mongo.GridStore(mongoose.connection.db, imgFileId, "w", {
			"content_type": "image/png",
			"metadata":{
			},
			"chunk_size": 1024*4
		});

		gs.open(function(error, gridstore) {
			if(error) {
				response.status(500);
				return next(error);
			}
 			gs.writeFile(request.files.img.path, function(error, gridstore) {
 				if(error) {
 					response.status(500);
 					return next(error);
 				}

 				// Unlink file from temp:
				fs.unlink(request.files.img.path, function(error) {
					if(error) {
						response.status(500);
						return next(error);
					}
				});
 			});
		});
	}

	// If this is a new thread:
	if(!('thread_id' in request.params) && request.param('title')) {
		// Create our instance:
		var newThread = new Thread({
			board : request.param('board'),
			title : request.param('title'),

			posts : [{
				text : request.param('text'),
				date : new Date()
			}]
		});

		if(imageIsUploaded) {
			newThread.posts[0].imgId = imgFileId;
		}
		
		newThread.save(function(error, theThread) {
			console.log('Just created 	Thread Id		' + theThread._id);
			console.log('				Thread PostId	' + theThread.posts[0]._id);
		});

		response.redirect('/');
	}
	// If this is a reply to a thread:
	else {
		var threadId = request.param('thread_id');

		// Check if threadId is a valid MongoDB ObjectId:
		if(!threadId.match(/^[0-9a-fA-F]{24}$/)) { // Validate if ObjectId according to http://stackoverflow.com/a/13851334
			response.status(400); // 400 Bad Request
			return next(new Error('Invalid request.'));
		}
		
		// Try to find the thread.
		var searchForThread = Thread.findById(threadId);
		searchForThread.exec(function(error, thread) {
			if(error) {
				response.status(500);
				return next(error);
			}

			// If the thread can't be found:
			if (!thread || 0 === thread.length) {
				response.status(404);
				return next("Cannot find the thread. It might have been deleted.");
			}
			
			if(thread.posts && Object.prototype.toString.call(thread.posts) === '[object Array]' ) { // The correct way to check if Object is an Array, according to http://stackoverflow.com/a/4775737
				// Insert the new post:
				thread.posts.push({
					text : request.param('text'),
					date : new Date()
				});

				if(imageIsUploaded) {
					thread.posts[thread.posts.length-1].imgId = imgFileId;
				}

				// Save the thread:
				thread.save(function(error, theThread) {
					if(error) {
						response.status(500);
						return next(error);
					}
					response.redirect('/');
				});
			}
			else {
				response.status(500);
				return next('Could not fulfill your request due to an database error.');
			}
		}); // end 
	} // end else
}