const express = require('express');
const router = express.Router();
const gameController = require('../../controllers/gameController');
const verifyJwT = require('../../middleware/verifyJWT');

router.route('/')
    .get(gameController.getUserGames)
    .post(gameController.createNewGame)
    .put(gameController.updateGame);

router.route('/:id')
    .get(gameController.getGameById);

module.exports = router;