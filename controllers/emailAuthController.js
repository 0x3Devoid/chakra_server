const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');
const argon2 = require('argon2');
const dotenv = require('dotenv');

dotenv.config();

const login = async (req, res) => {
    // const errors = validationRequest(req);
    // if (!errors.isEmpty()){
    //     return res.status(400).json({ errors: errors.array() });
    // }
    console.log('body -- ', req.body);
    console.log('query-- ', req.query);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'missing username/password' });
    }
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({ error: 'invalid username/password' });
    }
    try {
        const user = await User.findOne({ "local.email": email });
        if (!user) {
            return res.status(404).json({ error: 'user does not exist' });
        }
        const validPwd = await argon2.verify(user.local.password, password);
        if (!validPwd) {
            return res.status(401).json({ error: 'invalid password' });
        }
        accessToken = generateJWT({ email: user.email, id: user._id, duration: "5m"});
        refreshToken = generateJWT({ email: user.email, id: user._id, duration: "1d" });
        user.lastLogin = new Date();
        user.refreshToken = refreshToken;
        await user.save();
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 3600 * 1000 , sameSite: 'None', secured: true });
        return res.json({ accessToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}

const logout = async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.jwt) return res.sendStatus(204);
    const refreshToken = cookie.jwt;
    try {
        const user = await User.findOne({ 'commonFields.refreshToken': refreshToken });
        if (!user) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            res.sendStatus(204);
        }
        user.refreshToken = '';
        await user.save();
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

const register = async (req, res) => {
    // const errors = validationRequest(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() });
    // }
    const { username, email, password } = req.body;
    if (!email || !password || !username) {
        return res.status(400).json({ error: 'missing username/password/email' });
    }
    if (typeof email !== "string" || typeof password !== "string" || typeof username !== "string") {
        return res.status(400).json({ error: 'invalid username/password/email' });
    }
    try {
        const duplicate = await User.findOne({ 'local.email': email });
        if (duplicate) {
            return res.status(409).json({ error: 'account already exist' });
        }
        const password_hash = await argon2.hash(password);
        const newUser = new User({
            method: 'local',
            local: {
                username: username,
                email: email,
                password: password_hash,
                lastLogin: new Date()
            }
        });
        await newUser.save();
        console.log(newUser);
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
}

module.exports = { login, logout, register };
