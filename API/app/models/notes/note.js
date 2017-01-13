// MONGOOSE MODEL FOR A USER COLLECTION
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ObjectId = Schema.Types.ObjectId;

var NoteSchema = new Schema({
    title: { type: String, required: true },
    content: String,
    date: { type: Date, default: Date.now },
    owner: ObjectId,
    ownerFullname: String,
    shared: [{type: String}]

}, {versionKey: false});

module.exports = mongoose.model('Note', NoteSchema);
