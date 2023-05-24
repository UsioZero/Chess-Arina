const User = require('../model/User');

// change
const getAllUser = async (req, res) => {
    const food = await Food.find();
    if(!food) return res.sendStatus(204).json({'message': 'No food at all!'});
    res.json(food)
}

// change
const createNewFood = async (req, res) => {
    if(!req?.body?.name){
        return res.sendStatus(400).json({'message': 'Name are required!'});
    }

    try{
        const result = await Food.create({
            name: req.body.name
        });
        
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

// change
const updateFood = async (req, res) => {
    if(!req?.body?.id){
        return res.status(400).json({'message': 'ID is required!'});
    }

    const food_one = await Food.findOne({ _id: req.body.id}).exec();

    if(!food_one){
        return res.status(204).json({"message": `No food with ID ${req.body.id}.`});
    }
    if (req.body?.name) food_one.name = req.body.name;
    const result = await food_one.save();
    res.json(result);
}

// change
const deleteFood = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({ 'message': 'Food ID required'});

    const food_one = await Food.findOne({ _id: req.body.id}).exec();
    if(!food_one){
        return res.status(204).json({"message": `No food with ID ${req.body.id}.`});
    }
    const result = await food_one.deleteOne({ _id: req.body.id});
    res.json(result);
}

const getUser = async (req, res) => {
    if(!req?.user) return res.status(400).json({ 'message': 'User ID required'});

    const user = await User.findOne({ username: req.user}).exec();
    if(!user){
        return res.status(204).json({"message": `No user with ID ${req.user}.`});
    }

    const {password, ...rest} = user;

    res.json(rest);
}

module.exports = {
    // getAllUser,
    // createNewFood,
    // updateFood,
    // deleteFood,
    getUser
}
