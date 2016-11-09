// MONGOOSE MODEL FOR A USER COLLECTION
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
		name: {
        type: String,
        unique: true,
        required: true
    },
		password: {
        type: String,
        required: true
    },
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


//What to do before actually saving the user
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});


//How to check the password is correct, a compare password function
UserSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', UserSchema);
