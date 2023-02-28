// Test file for student classrooms

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Classroom = require('../models/classroom')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

let jsonToken = {}
let user = {}
let classroomObjects = []

beforeEach(async () => {
    await Classroom.deleteMany({})
    await User.deleteMany({})

    // Create a user with role teacher and get a token
    const passwordHash = await bcrypt.hash('Password1', 10)
    user = new User({ username: 'testuser1', name: 'Jimmy', passwordHash, })

    await user.save()

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, config.SECRET)
    jsonToken = { "token": token }

    // Create mock classroom data
    classroomObjects = helper.generateStudentsInitialClassrooms(user._id).map(classroom => new Classroom(classroom))
    const promiseArray = classroomObjects.map(classroom => classroom.save())
    await Promise.all(promiseArray)


})

describe('When there are initially some classrooms saved', () => {
    test('all a students classrooms are returned', async () => {
        const response = await api
            .get('/api/classrooms/studentClassrooms')
            .set('authorization', 'bearer ' + jsonToken.token)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(3)
    })

    test('a specific classroom is within the returned classrooms', async () => {
        const response = await api
            .get('/api/classrooms/studentClassrooms')
            .set('authorization', 'bearer ' + jsonToken.token)

        const roomNames = response.body.map(r => r.roomName)
        expect(roomNames).toContain('Test Classroom 1')
    })
})
