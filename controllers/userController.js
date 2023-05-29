const User = require('../model/User');

// change
const getAllUser = async (req, res) => {
    const food = await Food.find();
    if (!food) return res.sendStatus(204).json({ 'message': 'No food at all!' });
    res.json(food)
}

// change
const createNewFood = async (req, res) => {
    if (!req?.body?.name) {
        return res.sendStatus(400).json({ 'message': 'Name are required!' });
    }

    try {
        const result = await Food.create({
            name: req.body.name
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

// change
const updateUser = async (req, res) => {
    if (!req?.user) return res.status(400).json({ 'message': 'User ID required' });

    const user = await User.findOne({ username: req.user }).exec();
    if (!user) {
        return res.status(204).json({ "message": `No user with ID ${req.user}.` });
    }

    if (req.body?.username) user.username = req.body.username;
    if (req.body?.email) user.email = req.body.email;
    //if (req.body?.roles) user.roles = req.body.roles;
    if (req.body?.password) {
        const bcrypt = require('bcrypt');
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPwd;
    }
    if (req.body?.options) user.options = req.body.options;
    if (req.body?.gameList) user.gameList = req.body.gameList;
    if(req.body?.roles) user.roles.Premium = 1984;

    const result = await user.save();
    console.log(result);
    res.json(result);
}

// change
const deleteFood = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ 'message': 'Food ID required' });

    const food_one = await Food.findOne({ _id: req.body.id }).exec();
    if (!food_one) {
        return res.status(204).json({ "message": `No food with ID ${req.body.id}.` });
    }
    const result = await food_one.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.user) return res.status(400).json({ 'message': 'User ID required' });

    const user = await User.findOne({ username: req.user }).exec();
    if (!user) {
        return res.status(204).json({ "message": `No user with ID ${req.user}.` });
    }
    const data = user._doc;
    const { refreshTokenMobile, password, refreshToken, ...rest } = data;
    //console.log(rest);

    res.json(rest);
}

const getUserById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'User ID required' });

    const user = await User.findById(req.params.id);
    if (!user) {
        return res.status(204).json({ "message": `No User with ID ${req.params.id}.` });
    }
    res.json({ "username": user.username, "rena": user.options.real_name });
}

module.exports = {
    // getAllUser,
    // createNewFood,
    // updateFood,
    // deleteFood,
    updateUser,
    getUser,
    getUserById
}
