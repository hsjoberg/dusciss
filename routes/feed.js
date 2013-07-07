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


exports.createThread = function(request, response) {
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