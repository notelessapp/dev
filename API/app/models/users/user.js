// MONGOOSE MODEL FOR A USER COLLECTION
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var ObjectId = Schema.Types.ObjectId;

var UserSchema = new Schema({
		name: {
        type: String,
        unique: true
				},
		password: {
			//Should add a unique as true here at a later point MS
        type: String
    },
		fullname: String,
		occupation: String,
		email: String,
		paid: Number,
		avatar: {type: String, default: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mm&f=y"},
        friendslist: [{
                friendName: { type: String, unique: true },
                friendId: { type: String, unique: true },
                status: String,
                date: {type:Date, default: Date.now}
        }],
        required: ["name", "password"]

}, {versionKey: false});


//Verifying password, salting and hashing before saving user
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
