const Game = require('../model/Game');
const User = require('../model/User');

// change
const getAllGames = async (req, res) => {
    const game = await Game.find();
    if(!game) return res.sendStatus(204).json({'message': 'No games at all!'});
    res.json(game)
}

// change
const createNewGame = async (req, res) => {
    if (!req?.body?.user1) {
        return res.sendStatus(400).json({ 'message': 'User1 are required!' });
    }

    try {
        const result = await Game.create({
            user1: req.body.user1,
            moveData: req.body.moveData,
            
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

// change
const updateGame = async (req, res) => {
    console.log(req.body);
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'ID is required!' });
    }

    const game = await Game.findById(req.body.id).exec();
    if (!game) {
        return res.status(204).json({ "message": `No game with ID ${req.body.id}.` });
    }

    if (req.body?.user2) game.user2 = req.body.user2;
    if (req.body?.moveData) game.moveData = req.body.moveData;
    if (req.body?.win) game.win = req.body.win;

    const result = await game.save();
    console.log(result);
    res.json(result);
}

// change
// const deleteFood = async (req, res) => {
//     if(!req?.body?.id) return res.status(400).json({ 'message': 'Food ID required'});

//     const food_one = await Food.findOne({ _id: req.body.id}).exec();
//     if(!food_one){
//         return res.status(204).json({"message": `No food with ID ${req.body.id}.`});
//     }
//     const result = await food_one.deleteOne({ _id: req.body.id});
//     res.json(result);
// }

const getUserGames = async (req, res) => {
    if (!req?.user) return res.status(400).json({ 'message': 'User ID required' });
    console.log(req.user);
    const user = await User.findOne({username: req.user});
    const user_id = user.id;

    const games1 = await Game.find({ user1: user_id }).exec();
    const games2 = await Game.find({ user2: user_id }).exec();

    if (!games1 && !games2) {
        return res.status(204).json({ "message": `No games with user ${req.user}.` });
    }
    //console.log(games1);
    const data = [...games1, ...games2];
    //const {refreshTokenMobile, password, refreshToken, ...rest} = data;
    //console.log(data);
    console.log('authd');
    res.json(data);
}

const getGameById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Game ID required' });

    const game = await Game.findById(req.params.id);
    if (!game) {
        return res.status(204).json({ "message": `No game with ID ${req.params.id}.` });
    }
    res.json(game._doc);
}

module.exports = {
    getAllGames,
    createNewGame,
    updateGame,
    getUserGames,
    getGameById
}
