const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
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
        },
        password: {
            type: String,
        },
    }
);
commentSchema.virtual("commentId").get(function () {
    return this._id.toHexString(); // 이 부분의 this._id에 해당하는 부분을 가상화 시킨다.
});
commentSchema.set("toJSON", {
    virtuals: true,
});

module.exports = mongoose.model("Comment", commentSchema);