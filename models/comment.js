// Dependencies
var mongoose = require("mongoose");

// Schema constructer reference
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    commentCreated: {
        type: Date,
        default: Date.now
    }
});

var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;

