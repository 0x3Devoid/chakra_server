const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const router = require('./routes/index');
const database = require('./database');
const { requestLogger, errorLogger } = require('./middlewares/eventLogger');
const verifyJWT = require('./middlewares/verifyJWT');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');


dotenv.config();
server = express();



// server.use(verifyJWT);
server.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_ID
}));
server.use(passport.initialize());
server.use(passport.session());
server.use(cookieParser());
server.use(requestLogger);
server.use(router);
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));

server.use(errorLogger);

server.listen(
    process.env.PORT,
    () => console.log(`server running on port ${process.env.PORT}`)
);
