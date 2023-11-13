const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const generateJWT = require('../utils/generateJWT');
const bcryptjs = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

class userAuthentication{
    static async login(req, res){
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
        const validPwd = await bcryptjs.compare(password, user.local.password);;
        if (!validPwd) {
            return res.status(401).json({ error: 'invalid password' });
        }
       const accessToken = generateJWT({ email: user.email, id: user._id, duration: "5m"});
       const refreshToken = generateJWT({ email: user.email, id: user._id, duration: "1d" });
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

    static async logout(req, res){
        const cookie = req.cookies;
        console.log(`COOKIE ${cookie.jwt}`)
        if (!cookie?.jwt) return res.sendStatus(204);
        const refreshToken = cookie.jwt;
        try {
            const user = await User.findOne({ 'commonFields.refreshToken': refreshToken });
            if (!user) {
                res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
                res.sendStatus(204);
                return
            }
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            res.sendStatus(204);
        } catch (error) {
            console.log(error);
            return res.sendStatus(500);
        }
    }

    static async register(req, res){

        const { username, email, password } = req.body;
        if (!email) {
            return res.status(400).json({ error: 'email cant be empty' });
        }
        if (!password) {
            return res.status(400).json({ error: 'missing password' });
        }if (!username) {
            return res.status(400).json({ error: 'missing username' });
        }
        if (typeof email !== "string" || typeof password !== "string" || typeof username !== "string") {
            return res.status(400).json({ error: 'invalid username/password/email' });
        }
        try {
            const duplicate = await User.findOne({ 'local.email': email });
            if (duplicate) {
                return res.status(409).json({ error: 'account already exist' });
            }
            const password_hash = await bcryptjs.hash(password, 10);
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
}

module.exports = userAuthentication;
