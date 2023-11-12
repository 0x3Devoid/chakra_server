const express = require('express');
const verifyJWT = require('../middlewares/verifyJWT');
const { login, logout, register } = require('../controllers/emailAuthController');
const refreshTokenController = require('../controllers/refreshTokenController');
const passport = require('../config/googleAuthConfig');
const leaderBoard = require('../controllers/leaderBoardController');
const currentUserController = require('../controllers/currentUserController');
const increaseUserEarning = require('../controllers/increaseEarningController');


const router = express.Router()

//jwt manual routes

router.post('/auth/login', login);
router.post('/auth/register', register);
router.get('/auth/logout', logout);
router.get('/auth/refresh', refreshTokenController);

//google auth routes
router.get('/auth/google', passport.authenticate('google', {
    accessType: 'offline',
    approvalPrompt: 'force',
}), (req, res) => {
    // console.log('auth--', req.user);
    res.sendStatus(200);
});
router.get('/auth/google/redirect', passport.authenticate('google', {
    successRedirect: '/auth/google/redirect/done',
    failureRedirect: '/auth/google/failure'
}), (req, res) => {
    // console.log('redirect--', req.user);
    res.sendStatus(200);
});
router.get('/auth/google/failure', (req, res) => {
    return res.status(500).json({ message: 'something went wrong' });
});

router.get('/auth/google/redirect/done', (req, res) => {
    try {
        const accessToken = req.user.accessToken;
        const refreshToken = req.user.refreshToken;
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 3600 * 1000 , sameSite: 'None', secured: true });
        // console.log(req);
        req.session.accessToken = `jwt ${accessToken}`;
        res.setHeader('Authorization', `Bearer ${accessToken}`);// Set the Location header for the redirection
        return res.redirect('/');
    } catch (error) {
        return res.sendStatus(400);
    }
});

//user routes
router.get('/', verifyJWT, (req, res) => {
    // console.log(req.user);
    return res.json({ token: req.session.accessToken , email: req.user });
});
router.get('/leaderboard', verifyJWT, leaderBoard);
router.get('/me', verifyJWT, currentUserController);
router.get('/me/earning', verifyJWT, increaseUserEarning);


module.exports = router;
