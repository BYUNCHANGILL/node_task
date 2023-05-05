const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId:{
        type: String,
        required: true,
        unique: true,
    },
    nickname:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    confirm:{
        type: String,
        required: true,
    }

});

module.exports = mongoose.model("User", UserSchema);