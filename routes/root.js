const express = require('express');
const router = express.Router();
const path = require('path');
const isAuthorized = require('../middleware/isAuthorized');
const verifyJWT = require('../middleware/verifyJWT');

router.get('^/$|index(.html)?', verifyJWT,
    // add when authorized /main/index.html
    (req, res) => {
        if(req.user){
            res.sendFile(path.join(__dirname, '../views/main/index.html', 'index.html'));
        } else {
            res.sendFile(path.join(__dirname, '../views', 'index.html'));
        }
}); 

// mobile
router.get('/mobile(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'mobile', 'index.html'));
});

// profile
router.get('/profile(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'profile', 'index.html'));
});

router.get('/profile(.html)?/info', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'see_more', 'index.html'));
});

// login, no registr pop up
router.get('/register(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registartion', 'index.html'));
});

// login1, no registr pop up
router.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registartion', 'login.html'));
});

// login with qr, no registr pop up
router.get('/login-qr(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registartion', 'qr.html'));
});

//premium purchase
router.get('/premium(.html)?', verifyJWT ,(req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'premium', 'index.html'));
});

module.exports = router;