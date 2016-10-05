var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var AccountSchema = new Schema({
	username: String,
	password: String,
	fullname: String,
	email: String,
	role: String
	//note: password is automatically salted and hashed by passport-local-mongoose
});

AccountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Account', AccountSchema);