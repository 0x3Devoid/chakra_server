const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');

const UserController = require('../models/UserController.js')
const userAuthentication = require("../controllers/emailAuthController.js")
const currentUserController = require('../controllers/currentUserController');
const leaderBoard = require('../controllers/leaderBoardController');
const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(cookie());

router.get('/v1', UserController.app);
router.post('/login', userAuthentication.login);
router.post('/register', userAuthentication.register);
router.get('/logout', userAuthentication.logout);
router.get('/user', currentUserController.getUser);
router.get('/leaderboard', leaderBoard);





module.exports = router