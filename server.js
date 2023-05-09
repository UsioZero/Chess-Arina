const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
// set port equal to 3000
const PORT = process.env.PORT || 3000;

// jshow json and etc
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// access static data
app.use(express.static(path.join(__dirname, '/public')));

// router
app.use('/', require('./routes/root'));
// api
// auth
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
