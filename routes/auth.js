const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth/authController');
const logoutController = require('../controllers/auth/logoutController');
const refreshTokenController = require('../controllers/auth/refreshTokenController');
const registerController = require('../controllers/auth/registerController');

router.post('/register', registerController.handleNewUser);
router.get('/refresh', refreshTokenController.handleRefreshToken);
router.get('/logout', logoutController.handleLogout);
router.post('/login', authController.handleLogin);
router.post('/login-mobile', authController.handleLoginMobile);

module.exports = router;