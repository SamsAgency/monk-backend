const users = require('../routes/users')
const auth = require('../routes/auth')
const error = require('../middlewares/error')
const express = require('express')

module.exports = (app) => {
    // middlewares
    app.use(express.json())
    app.use('/api/users', users)
    app.use('/api/auth', auth)
    app.use(error)
}