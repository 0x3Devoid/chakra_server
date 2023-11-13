const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');

const UserController = require('../models/UserController.js')
const userAuthentication = require("../controllers/emailAuthController.js")


const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(cookie());

router.get('/v1', UserController.app);
router.post('/login', userAuthentication.login);
router.post('/register', userAuthentication.register);
router.get('/logout', userAuthentication.logout);





module.exports = router