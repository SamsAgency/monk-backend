const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    // check if token in the header exists
    const token = req.header('x-auth-token')
    if (!token) return  res.status('Access denied!! Not authorized')

    // decode the jwt
    try {
        const decoded = jwt.verify(token, config)
        req.user = decoded
        next()
    }
    catch (exp) {
        res.status(400).send('Invalid token!!')
    }
}