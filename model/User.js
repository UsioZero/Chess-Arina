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
    options_id: {
        type: String,
        require: false
    },    
    refreshToken: String,
    refreshTokenMobile: String
});

module.exports = mongoose.model('User', userSchema);