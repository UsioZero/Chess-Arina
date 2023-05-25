const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true
    },
    roles: {
        User: {
            type: Number,
            default: 2001
        },
        Premium: Number,
        Admin: Number
    },
    password: {
        type: String,
        require: true
    },
    options: {
        real_name: String,
        location: {
            country: String,
            state: String,
            city: String
        },
        theme: {
            type: Number,
            default: 1
        },
        connections: {
            google: Boolean,
            twitter: Boolean
        },
        is_profile_visible: {
            type: Boolean,
            default: true
        }
    },
    gameList: [{ game_id: String }],
    refreshToken: String,
    refreshTokenMobile: String
});

module.exports = mongoose.model('User', userSchema);