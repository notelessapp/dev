// MONGOOSE MODEL FOR A USER COLLECTION
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NoteSchema = new Schema({
    owner: String,
    shared: [{
      user_id: String
    }],
    title: String,
    content: String,
    type: Number,
    created: {type: Date, default: Date.now},
    modified: Date,
    locked: Boolean,
    pinned: Boolean
}, {versionKey: false});
//{
    //"owner": "1",
    //"shared": [{
    //  "user_id": "2"
    //}],
    //"title": "momma",
    //"content": "her",
    //"type": 2,
    //"locked": false
//}
module.exports = mongoose.model('Note', NoteSchema);
