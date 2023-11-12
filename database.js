const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DBConnection = mongoose.connect(
    process.env.MONGODB_URL,
);

module.exports = DBConnection;
