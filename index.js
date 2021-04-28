require('express-async-errors')
require('winston-mongodb')
const express = require('express')
const app = express()
const config = require('config')
const winston = require('winston')

require('./startup/logging')
require('./startup/routers')(app)
require('./startup/db')

// checking if there is token
if(!config.get('jwtPrivateKey')){
    throw new Error('FATAL ERROR!! No Token Provided!!')
}

// port
const port = process.env.PORT || 8000
app.listen(port, () => winston.info(`Conected to port ${port}...`))