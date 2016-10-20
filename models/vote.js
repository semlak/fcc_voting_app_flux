var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Account = require('./account.js');
var Poll = require('./poll');

var VoteSchema = new Schema({
	// owner could be null, which would mean it is unauthenticated user
	owner: { type: Schema.Types.ObjectId, ref: Account },
	poll: {type: Schema.Types.ObjectId, ref: Poll },
	answer_option: Number,
	ip_address: String
});

module.exports = mongoose.model('Vote', VoteSchema);
