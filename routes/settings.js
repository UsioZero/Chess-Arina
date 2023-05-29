const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|index', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'general.html'));
});

router.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'account.html'));
});

router.get('/avatar', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'avatar.html'));
});

router.get('/sequrity', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'sequrity.html'));
});

router.get('/theme', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'theme.html'));
});

module.exports = router;