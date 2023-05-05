const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        commentId: {
            type: String,
            required: true,
            unique: true
        },
        postId: {
            type: String,
        },
        userId: {
            type: String,
        },
        nickname: {
            type: String,
        },
        comment: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        }
    }
);

module.exports = mongoose.model("Comment", commentSchema);