const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../../controllers/userController');
const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    .get(verifyJWT, userController.getUser);

router.route('/:id')
    .get(verifyJWT, userController.getUserById);

module.exports = router;