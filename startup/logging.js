const winston = require('winston')
require('express-async-errors')

module.exports = (req, res, next) => {
    // handling unhundles exception
    process.on('uncaughtException', (exp) => {
        winston.error(exp.message, exp)
        process.exit(1)
    })

    // handling uncaught promises
    process.on('unhandledRejection', (exp) => {
        winston.error(exp.message, exp)
        process.exit(1)
    })

    // winston
    winston.add(winston.transports.File, {filename : 'logfile.log'})
    winston.add(winston.transports.MongoDB, {db : 'mongodb://localhost/monk', level: 'info'})
}