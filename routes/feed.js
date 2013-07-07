/*
	Methods in this module:
	-	[GET]	showFeed(request, response)
					Shows the feed or a specific board.
	-	[GET]	showCreateFeed(request, response)
					Shows the page to create a new thread.
	-	[POST]	newPost()
					Handles requests for new board posts
*/


var Thread = require('../models/ThreadModel');

exports.showFeed = function(request, response){
	var mainFeed = true;
	var board = "Main Feed";

	var searchForThreads = Thread.find();

	if('board' in request.params) { // alternative method request.params.hasOwnProperty('feed')
		board = request.params.board;
		searchForThreads.where('board').equals(board.toLowerCase());
		mainFeed = false; // As we're getting a specific board
	}

	searchForThreads.exec(function(error, threads) {
		if(error) throw error;

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
		})

		newThread.save(function(error, theThread) {
			console.log('Just saved ' + theThread);
		});

		response.redirect('/');
	}
	// If this is a reply to a thread:
	else {
		var threadId = request.param('thread_id');

		// Check if threadId is a valid MongoDB ObjectId:
		if(!threadId.match(/^[0-9a-fA-F]{24}$/)) { // Validate if ObjectId according to http://stackoverflow.com/a/13851334
			next('Invalid request.');
		}
		else {
			// Try to find the thread.
			var searchForThread = Thread.findById(threadId);
			searchForThread.exec(function(error, thread) {
				if(error) {
					next(error);
				}
				else {
					// If the thread can't be found:
					if (!thread || 0 === thread.length) {
						next("Cannot find the thread. It might have been deleted.");
					}
					else {
						if(thread.posts && Object.prototype.toString.call(thread.posts) === '[object Array]' ) { // The correct way to check if Object is an Array, according to http://stackoverflow.com/a/4775737
							// Insert the new post:
							thread.posts.push({
								text : request.param('text'),
								date : new Date()
							});

							// Save the thread:
							thread.save(function(error, theThread) {
								if(error)
									next(error);
								else
									response.redirect('/');
							});
						}
						else {
							next('Could not fulfill your request due to an database error.');
						}
					}
				} // searchForThread.exec(function(error, thread) {
			}); // end 
		} // end else
	} // end else
}