const jwt = require('jsonwebtoken');
const User = require('../model/User');

const verifyJWT = (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.accessToken) {
        return res.redirect('/unauth');
    }
    const token = cookies.accessToken;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {

            if (err.name === 'TokenExpiredError') {

                const refreshToken = cookies.jwt;
                if (!refreshToken) {
                    return res.redirect('/unauth');
                }

                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
                    if (err) {

                        return res.redirect('/unauth');
                    }

                    const foundUser = await User.findOne({ refreshToken }).exec();
                    if (!foundUser) return res.redirect('/unauth');
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


                    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 60 * 60 * 1000 })

            
                    req.user = foundUser.username;
                    req.roles = roles;

                    next();
                });
            } else {
                return res.redirect('/unauth');
            }
        } else {
            req.user = decoded.UserInfo.username;
            req.roles = decoded.UserInfo.roles;

            next();
        }
    });
};

const verifyJWTMobile = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(403);
        req.user = decoded.UserInfo.username;
        req.roles = decoded.UserInfo.roles;
        next();
    });
};

module.exports = {verifyJWT, verifyJWTMobile};