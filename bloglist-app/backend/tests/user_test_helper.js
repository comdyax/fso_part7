const User = require('../models/user')

const initialUsers = [
    {
        username: 'John Jimm',
        name: 'blog blog',
        passwordHash: '1248234'
    },
    {
        username: 'blog main 2',
        name: 'logblog',
        passwordHash: 'ksdbgwiu3'
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}



module.exports = { initialUsers, usersInDb }