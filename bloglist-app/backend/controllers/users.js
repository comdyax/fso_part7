const bcyrpt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', { url: 1, title: 1, author: 1 })
    response.json(users)
})

usersRouter.post('/', async (request, response, next) => {
    const { username, name, password } = request.body

    if (password && password.length > 2) {
        const saltRounds = 10
        const passwordHash = await bcyrpt.hash(password, saltRounds)

        const user = new User({
            username: username,
            name: name,
            passwordHash: passwordHash
        })

        const savedUser = await user.save()

        response.status(201).json(savedUser)
    } else {
        const error = {
            name: 'PasswordValidationError',
            message: 'password too short!'
        }
        next(error)
    }
})

module.exports = usersRouter