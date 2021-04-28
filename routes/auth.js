const bcrypt = require('bcrypt')
const {User} = require('../models/user')
const Joi = require('joi')
const express = require('express')
const router = express()

router.post('/', async (req, res) => {
    const {error} = validateAuth(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // find the user
    let user = await User.findOne({email : req.body.email})
    if (!user) return res.status(400).send('Invalid Email or Password')


    // compare password
    const password = await bcrypt.compare(req.body.password, user.password)
    if (!password) return res.status(400).send('Invalid Email or Password')

    const token = user.generateTokens()
    res.send(token)
    
})

const validateAuth = (req) => {
    const schema ={
        email : Joi.string().email().max(100).required(),
        password: Joi.string().max(100).required()
    }

    return Joi.validate(req, schema)
}

module.exports = router