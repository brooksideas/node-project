const config = require('config');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: { type: Number, default: 23 },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    occupation: { type: String, default: 'Idea Owner' },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    isActive: { type: Boolean, default: false },
    ideaIdList: {
        type: [String], default: [],
        validate: {
            validator: function (list) {
                let correctList = true;
                for (v in list) {
                    if (list[v].length !== 24) {
                        correctList = false;
                    }
                }
                return correctList && list;
            },
            message: 'The given Idea Ids List contains Error.',
        }
    },
    isAdmin: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
});

// the user object is responsible for generating Access token 
// According to the Information Expert Principle of OOP
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
    return token;
}

const Users = mongoose.model('Users', userSchema);


function validateUser(user) {
    const schema = {
        firstName: Joi.string().min(5).max(50).required(),
        lastName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        ideaIdList: Joi.raw(),
        isActive: Joi.bool(),
        age: Joi.number().min(10).max(120),
        occupation: Joi.string(),
        isAdmin: Joi.bool()
    };
    return Joi.validate(user, schema);
}

exports.Users = Users;
exports.validate = validateUser;