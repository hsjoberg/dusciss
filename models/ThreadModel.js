if(global.mongoose) {
	var mongoose = global.mongoose;
}
else {
	console.log("Notice: Mongoose was not found in global scope when requiring ThreadModel.js");
	var mongoose = require('mongoose');
	// TODO error handling
}

var threadSchema = mongoose.Schema({
	board: { type: String },
	title: String,

	posts : [{
		text : String,
		date : Date,
		imgId : mongoose.Schema.Types.ObjectId
	}],
});

module.exports = mongoose.model('Thread', threadSchema);