// MONGOOSE MODEL FOR A USER COLLECTION
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,


	
	__v: {type:Number, select: false}
}, {versionKey: false});

module.exports = mongoose.model('User', UserSchema);
