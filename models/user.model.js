const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = mongoose.Schema({
    method: {
        type: String,
        enum: ['local', 'google'],
        required: true
    },
    local: {
        username: {
            type: String, lowercase: true
        },
        email: {
            type: String, unique: true, lowercase: true
        },
        password: {
            type: String,
        },
        
    },
    google: {
        username: {
            type: String, lowercase: true
        },
        email: {
            type: String, unique: true, lowercase: true
        },
    },
    commonFields: {
        lastLogin: {
            type: Date, required: true, default: Date.now
        },
        earning: {
            type: Number, default: 0
        },
        joined: {
            type: Date, default: Date.now
        },
        refreshToken: {
            type: String, required: false
        }
    }
});

const user = mongoose.model(
    'User',
    UserSchema
);

module.exports = user;
