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
                        // Refresh token is invalid or expired, redirect to '/unauth'
                        return res.redirect('/unauth');
                    }

                    const foundUser = await User.findOne({ refreshToken }).exec();
                    if (!foundUser) res.sendStatus(403);

                    const roles = Object.values(foundUser.roles);
                    // Generate a new access token
                    const accessToken = jwt.sign(
                        {
                            "UserInfo": {
                                "username": foundUser.username,
                                "email": foundUser.email,
                                "roles": roles
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn: '15m' } //Change to 5-15 min
                    );

                    // Set the new access token as an HTTP-only cookie
                    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 60 * 60 * 1000 })

                    // Add the decoded token information to the request object
                    req.user = foundUser.username;
                    req.roles = roles;

                    // Continue to the next middleware or route handler
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

module.exports = verifyJWT;