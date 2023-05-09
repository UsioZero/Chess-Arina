const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'general.html'));
});

router.get('^/$|account(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'account.html'));
});

router.get('^/$|avatar(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'avatar.html'));
});

router.get('^/$|sequrity(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'sequrity.html'));
});

router.get('^/$|theme(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'settings', 'theme.html'));
});

module.exports = router;