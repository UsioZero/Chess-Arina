const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|index', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'game_page', 'index.html'));
});

router.get('/link', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'game_page_for_oleg', 'index.html'));
});

module.exports = router;