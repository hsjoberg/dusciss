var env = process.env.NODE_ENV || 'development';

exports.errorHandler = function(error, request, response, next) {
	// Borrowed some code from errorHandler.js from ExpressJS/Connect
	if (error.status) response.statusCode = error.status;
	if (response.statusCode < 400) response.statusCode = 500;

	response.render('error', {
		appTitle : 'Dusciss',
		error : error,
		env : env
	});
};