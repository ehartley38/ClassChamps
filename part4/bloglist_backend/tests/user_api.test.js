const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})

})

describe('When there are initially no users saved', () => {
    test('all users are returned', async () => {
        const response = await api.get('/api/users').expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(0)
    })

})

describe('Addition of a new user', () => {
    test('succeeds with valid data', async () => {
        const newUser = {
            "username": "testuser1",
            "name": "Jimmy",
            "password": "Password1"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(1)

        const usernames = usersAtEnd.map(user => user.username)
        expect(usernames).toContain('testuser1')

    })

})