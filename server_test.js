// const isAvatar = false;
// console.log((isAvatar? "avatar" : "bg") + 'ssssssssss');
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
//const personalCounter = require('./middleware/personalCounter');
const connectDB = require('./config/dbConn');

connectDB();

const User = require('./model/User');

const func = async function () {
    const users = await User.find().exec();

    users.forEach(async user => {
        user.options.real_name = "Stepan Giga";
        user.options.location = {
            country: "Ukraine",
            state: "Zakarpattia",
            city: "Bilky"
        },
        user.options.connections = {
            google: false,
            twitter: false
        }
        //const res = await user.save();
    })
}

func();

// mongoose.connection.once('open', () => {
//     console.log('Connected to DB');
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// });