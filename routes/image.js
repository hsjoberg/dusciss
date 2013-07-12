exports.showImage = function(request, response, next) {
	var notFound = function () {
		response.status(404);
		next(new Error('Cannot find the requested file.'))
	};

	if(request.params.id && request.params.id.match(/^[0-9a-fA-F]{24}$/)) {
		mongoose.mongo.GridStore.exist(mongoose.connection.db, mongoose.mongo.ObjectID(request.params.id), function(error, exists) {
			if(error) {
				response.status(500);
				next(error);
			}
			if(exists) {
				// Open the file:
				mongoose.mongo.GridStore(mongoose.connection.db, mongoose.mongo.ObjectID(request.params.id), 'r').open(function(error, gridstore) {
					if(error) throw error;
					
					if(gridstore.contentType) {
						response.set('Content-Type', gridstore.contentType);
					}
					if(gridstore.length) {
						response.set('Content-Length', gridstore.length);
					}
					response.set('Transfer-Encoding', 'chunked');
					
					// Stream the data:
					var stream = gridstore.stream(true);
					stream.pipe(response);
				});
			}
			else {
				notFound();
			}
		});
	}
	else {
		notFound();
	}
};