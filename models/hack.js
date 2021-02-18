var mongoose  = require('mongoose');

var hackSchema = new mongoose.Schema({
	name: String,
	topic: String,
	image: String,
	discription: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

module.exports = mongoose.model("Hack", hackSchema);