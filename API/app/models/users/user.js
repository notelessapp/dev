// MONGOOSE MODEL FOR A USER COLLECTION
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
		username: String,
		password: String,
		fullname: String,
		email: String,
		paid: Number,
		avatar: String,
		notes: [{
			title: String,
			locked: Boolean,
			date: {type: Date, default: Date.now},
			presets: [{
				template: Number,
			}]}]


}, {versionKey: false});

module.exports = mongoose.model('User', UserSchema);
