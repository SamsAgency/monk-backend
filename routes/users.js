const express = require('express')
const auth = require('../middlewares/auth')
const admin = require('../middlewares/admin')
const router = express.Router()
const {User, validate} = require('../models/user')
const bcrypt = require('bcrypt')
const _ = require('lodash')

// get
router.get('/', async (req, res) => {
    throw new Error('Something went wrong')
    const pageSize = 20
    const pageNumber = 2
    const users = await User.find()
        .sort('_id')
        .select('-password')
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
    res.send(users)
})

// get by id
router.get(':/id', async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!users) return res.status(404).send('That user does not exist')
    res.send(user)
})

// post request
router.post('/', async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const email = await User.findOne({email : req.body.email})
    if (email) return res.status(400).send('That user exists')

    let user = new User({
        username : req.body.username,
        bio : req.body.bio,
        images : req.body.images,
        email : req.body.email,
        phone : req.body.phone,
        bodyType : req.body.bodyType,
        age : req.body.age,
        services : req.body.services,
        isPremium : req.body.isPremium,
        isAdmin : req.body.isAdmin,
        location : req.body.location,
        password : req.body.password
    })


    
    // hashing passwords
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    
    user = await user.save()

    const token = user.generateTokens()
    res.header('x-auth-token', token).send(_.pick(user, [
        'id', 'username', 'bio', 'images', 'email', 'phone', 'bodyType', 'age', 'services', 'location', 'isPremium'
    ]))
})

// put request
router.put('/:id', async (req, res) => {
    const {error} = validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findByIdAndUpdate(req.params.id, {
        $set : {
            username : req.body.username,
            bio : req.body.bio,
            images : req.body.images,
            email : req.body.email,
            phone : req.body.phone,
            bodyType : req.body.bodyType,
            age : req.body.age,
            services : req.body.services,
            isPremium : req.body.isPremium,
            isAdmin : req.body.isAdmin,
            location : req.body.location,
            password : req.body.password
        }
    })


    if (!user) return res.status(404).send('That user does not exists')

    // hashing passwords
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    res.send(user)
})

// delete request
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id)
    if (!user) return res.status(404).send('That user does not exists')
    res.send(user)
})

// exports
module.exports = router