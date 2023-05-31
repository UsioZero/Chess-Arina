const User = require('../../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email  || !pwd) return res.status(400).json({ 'message': 'Email or username and password are required.' });
    
    let foundUser = await User.findOne({ email: email }).exec(); 
    if (!foundUser) foundUser = await User.findOne({ username: email }).exec(); 
    if (!foundUser) return res.status(401).json({ 'message': 'No such user' });
    
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);

        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' } 
        );
 
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } 
        );
      
        foundUser.refreshToken = refreshToken;
        result = await foundUser.save();
    
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 60 * 60 * 1000 })
        res.json({ accessToken })
    } else {
        res.sendStatus(401);
    }
}

const handleLoginMobile = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email  || !pwd) return res.status(400).json({ 'message': 'Email or username and password are required.' });
    
    let foundUser = await User.findOne({ email: email }).exec(); 
    if (!foundUser) foundUser = await User.findOne({ username: email }).exec(); 
    if (!foundUser) return res.status(401).json({ 'message': 'No such user' });

    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        //create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "email": foundUser.email,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1d' } //Change to 5-15 min
        );
        //create JWTs
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '30d' } //Change to ???
        );
        //Saving refresh token with cur user
        foundUser.refreshTokenMobile = refreshToken;
        result = await foundUser.save();
        //console.log(result);
        res.json({ "accessToken": accessToken, "refreshToken": refreshToken });
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin, handleLoginMobile };