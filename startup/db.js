const mongoose = require('mongoose')

module.exports = () => {
    // connecting to the database
    mongoose.connect('mongodb://localhost/monk', {useNewUrlParser : true, useUnifiedTopology : true})
    .then(() => console.log('Connected to mongodb...'))
}