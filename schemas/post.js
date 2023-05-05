const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    postsId: { 
        type: String,
        required: true,
        unique: true,   // 고유한 값
    },
    userId: {
        type: String,
        required: true,
    },
    nickname: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    }
});

module.exports = mongoose.model("posts", postsSchema);