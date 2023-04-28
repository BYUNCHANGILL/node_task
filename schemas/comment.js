const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentId: {
        type: String,
        required: true,
        unique: true
    },
    postsId: { 
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    }
});

module.exports = mongoose.model("comment", commentSchema);