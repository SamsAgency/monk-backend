const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')

// user schema
const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required: true,
        minlength: 3,
        maxlength: 100 
    },
    bio : {
        type: String,
        required: true,
        minlength: 100,
        maxlength: 1500
    },
    images : {
        type : Array,
        required: true,
        min: 1,
        max: 5 
    }, 
    email : {
        type : String,
        required: true,
        minlength: 3,
        maxlength: 100 
    },
    phone : {
        type: String,
        required : true,
        minlength: 10,
        maxlength : 14
    }, 
    bodyType : {
        type : String,
        required: true,
        minlength: 3,
        maxlength: 100 
    },
    age : {
        type : Number,
        required: true,
        minlength: 3,
        maxlength: 100 
    },
    services : {
        type: Array
    },
    isPremium : {
        type : Boolean,
        required: true,
    },
    isAdmin : {
        type : Boolean
    },
    location : {
        type : String,
        required: true,
        minlength: 3,
        maxlength: 100 
    },
    password : {
        type : String,
        required: true,
        minlength: 6,
        maxlength: 1500
    }, 
})

// adding a method that generates token
userSchema.methods.generateTokens = function(){
    const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
    return token
}

// the model
const User = mongoose.model('Monk', userSchema)

// joi validation
const validateUser = (user) => {
    const schema = {
        username : Joi.string().min(3).max(100).required(),
        bio : Joi.string().min(100).max(1500).required(),
        images : Joi.string().required(),
        email : Joi.string().email().min(3).max(100).required(),
        phone : Joi.string().min(10).max(14).required(),
        bodyType : Joi.string().min(3).max(100).required(),
        age : Joi.number().min(18).max(65).required(),
        services: Joi.string().required(),
        isPremium : Joi.boolean().required(),
        isAdmin : Joi.boolean(),
        location : Joi.string().min(3).max(100).required(),
        password : Joi.string().min(3).max(150).required()
    }

    return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser
exports.userSchema = userSchema