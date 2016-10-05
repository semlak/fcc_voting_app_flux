var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Account = require('./account.js');
var Vote = require('./vote');

var PollSchema = new Schema({
	// author: { type: Schema.Types.ObjectId, ref: 'Account' },
	author: String,
	owner: { type: Schema.Types.ObjectId, ref: 'Account' },
	title: String,
	question: String,
	answer_options: [String],
	votes: [{type: Schema.Types.ObjectId, ref: 'Vote' }]
});


PollSchema.pre('remove', function(next) {
    // 'this' is the client being removed. Provide callbacks here if you want
    // to be notified of the calls' result.
    Vote.remove({poll: this._id}).exec();
    next();
});


module.exports = mongoose.model('Poll', PollSchema);
