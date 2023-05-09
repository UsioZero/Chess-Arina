const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
// set port equal to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
