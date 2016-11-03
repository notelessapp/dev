// MONGOOSE MODEL FOR A USER COLLECTION
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    name: String


}, {versionKey: false});

module.exports = mongoose.model('Note', NoteSchema);
