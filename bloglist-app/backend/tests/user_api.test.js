const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./user_test_helper')

const app = require('../app')

const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})
    const userList = helper.initialUsers.map(user => new User(user))
    const promiseArray = userList.map(user => user.save())
    await Promise.all(promiseArray)
})

describe('User Validation', () => {
    test('username is not given expect error', async () => {
        const newUser = {
            name: 'ABC',
            password: '44144123'
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.body.error).toEqual('User validation failed: username: Path `username` is required.')
    })
    test('username is too short', async () => {
        const newUser = {
            username: 'ad',
            name: 'ABC',
            password: '44144123'
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.body.error)
            .toEqual('User validation failed: username: Path `username` (`ad`) is shorter than the minimum allowed length (3).')
    })
    test('username is not unique', async () => {
        const newUser = {
            username: 'John Jimm',
            name: 'ABC',
            password: '44144123'
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.body.error)
            .toEqual('User validation failed: username: Error, expected `username` to be unique. Value: `John Jimm`')
    })
    test('password is too short', async () => {
        const newUser = {
            username: 'adaflubafs',
            name: 'ABC',
            password: '3'
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.body.error)
            .toEqual('password too short!')
    })
    test('password missing', async () => {
        const newUser = {
            username: 'adaflubafs',
            name: 'ABC',
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        expect(response.body.error)
            .toEqual('password too short!')
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})