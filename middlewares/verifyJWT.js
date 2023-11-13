const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyJWT = (req, res, next) => {
    const header = req.headers['authorization'] || req.headers['Authorization'] || req.session.accessToken;
    if (!header) return res.status(401).json({ error: 'Missing or invalid token' });
    
    const accessToken = header.split(' ')[1];
    if (!accessToken) return res.status(500).json({ error: 'Invalid token format' });

    jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Failed to authenticate token' });
        }

        req.user = { email: decoded.email, id: decoded._id };
        next();
    });
}

module.exports = verifyJWT;
