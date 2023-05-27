const express = require('express');
const router = express.Router();
const path = require('path');

const verifyJWT = require('../middleware/verifyJWT');
const runCommand = require('../middleware/runCommand');
const fileSaver = require('../middleware/fileSaver');
const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../middleware/filesPayloadExists');
const fileExtLimiter = require('../middleware/fileExtLimiter');
const fileSizeLimiter = require('../middleware/fileSizeLimiter');

router.get('/', verifyJWT, (req, res) => {
    //if(!isAuthorized(req)) res.
    res.sendFile(path.join(__dirname, '../views/main', 'index.html'));
});

router.get('/unauth', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// mobile
router.get('/mobile', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'mobile', 'index.html'));
});

// profile
router.get('/profile', verifyJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'profile', 'index.html'));
});

router.get('/profile/info', verifyJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'see_more', 'index.html'));
});

// login, no registr pop up
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registartion', 'index.html'));
});

// login1, no registr pop up
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registartion', 'login.html'));
});

// login with qr, no registr pop up
router.get('/login-qr', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'registartion', 'qr.html'));
});

//premium purchase
router.get('/premium', verifyJWT, (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'premium', 'index.html'));
});

// verify
router.post('/runComm', (req, res) =>
    runCommand(req, res)
);

router.post('/fileUpload',
    verifyJWT,
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png']),
    fileSizeLimiter, 
    fileSaver)

module.exports = router;