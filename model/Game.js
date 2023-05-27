const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gameSchema = new Schema({
    user1: {
        type: String,
        require: true
    },
    user2: {
        type: String,
        require: false
    },
    moveData: {
        playerId: String,
        dataArray: [String],
        legalMovesForPlayer: [[Number]]
    }
});

module.exports = mongoose.model('Game', gameSchema);