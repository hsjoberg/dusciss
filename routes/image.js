exports.showImage = function(request, response, next) {
	mongoose.mongo.GridStore.exist(mongoose.connection.db, mongoose.mongo.ObjectID(request.params.id), function(error, exists) {
		if(error) throw error;

		if(exists) {
			// Open the file:
			mongoose.mongo.GridStore(mongoose.connection.db, mongoose.mongo.ObjectID(request.params.id), 'r').open(function(error, gridstore) {
				if(error) throw error;

				gridstore.read(function(error, binStrFile) {
					if(gridstore.contentType) {
						response.set('Content-Type', gridstore.contentType);
					}
					if(gridstore.length) {
						response.set('Content-Length', gridstore.length);
					}
					response.end(binStrFile);
				});
			});
		}
		else {
			response.status(404);
			response.set('Content-Type', 'text/plain');
			response.end("Cannot find the file.");
		}
	});
};