const jwt = require('jsonwebtoken');

const isAuthorized = (req) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return false;
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return false;
            return true;
        }
    );
    return true;
}

module.exports = isAuthorized;