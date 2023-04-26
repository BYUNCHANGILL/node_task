const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
    postsId: { 
        // type: Number, 
        type: String,
        required: true,
        unique: true, 
    },
    user: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("posts", postsSchema);



