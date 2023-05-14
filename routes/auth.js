const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth/authController');
const logoutController = require('../controllers/auth/logoutController');
const refreshTokenController = require('../controllers/auth/refreshTokenController');
const registerController = require('../controllers/auth/registerController');

router.post('/', registerController.handleNewUser);
router.get('/', refreshTokenController.handleRefreshToken);
router.get('/', logoutController.handleLogout);
router.post('/', authController.handleLogin);

module.exports = router;