const User = require('../../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, user, pwd } = req.body;
    if (!(email || user) || !pwd) return res.status(400).json({ 'message': 'Email or username and password are required.' });
    
    let foundUser = await User.findOne({ email: email }).exec(); 
    if (user) { foundUser = await User.findOne({ username: user }).exec(); }
    if (!foundUser) return res.status(401).json({ 'message': 'No such user' });

    const match = bcrypt.compare(pwd, foundUser.password);
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
            { expiresIn: '5m' } //Change to 5-15 min
        );
        //create JWTs
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' } //Change to ???
        );
        //Saving refresh token with cur user
        foundUser.refreshToken = refreshToken;
        result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken })
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };