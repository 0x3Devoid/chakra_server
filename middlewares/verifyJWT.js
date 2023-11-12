const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const verifyJWT = (req, res, next) => {
    const header = req.headers['authorization'] || req.headers['Authorization'] || req.session.accessToken;
    if (!header) return res.sendStatus(401);
    console.log(header);
    const accessToken = header.split(' ')[1];
    if (!accessToken) return res.sendStatus(403);
    console.log(accessToken);
    jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN,
        (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.user = { email: decoded.email, id: decoded._id };
            next();
        }
    );
}

module.exports = verifyJWT;
