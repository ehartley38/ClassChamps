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
beforeEach(async () => {
    await Classroom.deleteMany({})
    await User.deleteMany({})

    // Create a user and get a token
    const passwordHash = await bcrypt.hash('Password1', 10)
    const user = new User({ username: 'testuser1', name: 'Jimmy', passwordHash })

    await user.save()

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, config.SECRET)
    jsonToken = { "token": token }

    // Create mock classroom data
    const classroomObjects = helper.initialClassrooms.map(classroom => new Classroom(classroom))
    const promiseArray = classroomObjects.map(classroom => classroom.save())
    await Promise.all(promiseArray)
})



/*
describe('When there are initially no classrooms saved', () => {
    test('no student classrooms are returned', async () => {
        const response = await api.get('/api/classrooms/studentClassrooms')
            .set('authorization', 'bearer ' + jsonToken.token)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(0)
    })
})*/

describe('When there are initially some classrooms saved', () => {
    test('all a students classrooms are returned', async () => {
        const response = await api
            .get('/api/classrooms/studentClassrooms')
            .expect('Content-Type', /application\/json/)

            
        })
})

describe('Addition of a new classroom', () => {
    test('succeeds with valid classroom data', async () => {
        const newClassroom = {
            "roomName": "Test Classroom 1",
        }

        await api
            .post('/api/classrooms')
            .set('authorization', 'bearer ' + jsonToken.token)
            .send(newClassroom)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const classroomsAtEnd = await helper.classroomsInDb()
        expect(classroomsAtEnd).toHaveLength(1)

        const roomNames = classroomsAtEnd.map(classroom => classroom.roomName)
        expect(roomNames).toContain('Test Classroom 1')

    })

    test('fails if data is invalid', async () => {
        const newClassroom = {
            "roomName": ""
        }
        await api
            .post('/api/classrooms')
            .set('authorization', 'bearer ' + jsonToken.token)
            .send(newClassroom)
            .expect(400)
    })

})


