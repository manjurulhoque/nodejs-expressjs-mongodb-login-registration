var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

// User Schema

var userSchema = mongoose.Schema({
    username: {
        type: String
    },
    email: {
        type: String
    },
    password:{
        type: String,
        bcrypt: true
    }
}, {timestamps: true});

module.exports = User = mongoose.model('users', userSchema);