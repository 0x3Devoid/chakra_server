const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');

const UserController = require('../models/UserController.js')


const router = express.Router();

router.use(cors());
router.use(express.json());
router.use(cookie());

router.get('/v1', UserController.app);


module.exports = router