const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../../controllers/userController');
const { verifyJWT } = require('../../middleware/verifyJWT');

const fileUpload = require('express-fileupload');
const filesPayloadExists = require('../../middleware/filesPayloadExists');
const fileExtLimiter = require('../../middleware/fileExtLimiter');
const fileSizeLimiter = require('../../middleware/fileSizeLimiter');

router.route('/')
    .get(verifyJWT, userController.getUser)
    .put(verifyJWT, userController.updateUser);

router.route('/:id')
    .get(verifyJWT, userController.getUserById);

// router.route('/upLoadAvatar').post(
//     fileUpload({ createParentPath: true }),
//     filesPayloadExists,
//     fileExtLimiter(['.png', '.jpg', 'jpeg', 'bmp', 'webp']),
//     fileSizeLimiter)
module.exports = router;