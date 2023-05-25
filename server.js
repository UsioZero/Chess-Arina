require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const { logger } = require('./middleware/logger');

const cookieParser = require('cookie-parser');

const verifyJWT = require('./middleware/verifyJWT');

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

// tg bot
//const botOn = require('./middleware/telegramBot');

// db import
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');

// set port equal to 3000
const PORT = process.env.PORT || 3000;

// connect to DB
connectDB();

//logger
app.use(logger);

// cors + credentinals
app.use(credentials);
app.use(cors(corsOptions));

// jshow json and etc
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// tg bot on
//botOn();

// access static data
app.use(express.static(path.join(__dirname, '/public')));
app.use('/settings', express.static(path.join(__dirname, '/public')));
app.use('/profile', express.static(path.join(__dirname, '/public')));
app.use('/game', express.static(path.join(__dirname, '/public')));

// router
app.use('/', require('./routes/root'));
app.use('/game', verifyJWT, require('./routes/game'));
app.use('/settings', verifyJWT, require('./routes/settings'));
// api
app.use('/api/user', require("./routes/api/user"));
// auth
app.use('/auth', require('./routes/auth'));
// 404
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404', 'index.html'));
  } else if (req.accepts('json')) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type('txt').send("404 Not Found");
  }
});

mongoose.connection.once('open', () => {
  console.log('Connected to DB');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});