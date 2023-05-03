const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    postsId: { 
        type: String,
        required: true,
        unique: true, 
    },
    userId: {
        type: String,
        required: true,
        unique: true
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