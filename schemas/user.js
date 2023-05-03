const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, // 필수
        unique: true,   // 고유한 값
    },
    nickname: {
        type: String,
        required: true, // 필수
        unique: true,   // 고유한 값
    },
    password: {
        type: String,
        required: true, // 필수
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
});

UserSchema.virtual('userIDString').get(function () {
    return this._id.toHexString();
});

UserSchema.set('toJSON', {
    virtuals: true, // JSON 형태로 가공할 때, userId를 출력 시켜준다.
});

module.exports = mongoose.model('User', UserSchema);