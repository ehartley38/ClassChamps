// Test file for teacher classrooms

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
    user = new User({ username: 'testuser1', name: 'Jimmy', passwordHash, role: 'teacher' })

    await user.save()

    const userForToken = {
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken, config.SECRET)
    jsonToken = { "token": token }

    // Create mock classroom data
    classroomObjects = helper.generateTeachersInitialClassrooms(user._id).map(classroom => new Classroom(classroom))
    const promiseArray = classroomObjects.map(classroom => classroom.save())
    await Promise.all(promiseArray)


})

describe('When there are initially some classrooms saved', () => {
    test('all a teachers classrooms are returned', async () => {
        const response = await api
            .get('/api/classrooms/teacherClassrooms')
            .set('authorization', 'bearer ' + jsonToken.token)
            .expect('Content-Type', /application\/json/)

        expect(response.body).toHaveLength(3)
    })

    test('a specific classroom is within the returned classrooms', async () => {
        const response = await api
            .get('/api/classrooms/teacherClassrooms')
            .set('authorization', 'bearer ' + jsonToken.token)

        const roomNames = response.body.map(r => r.roomName)
        expect(roomNames).toContain('Test Classroom 1')
    })

})

describe('Addition of a new classroom', () => {
    test('succeeds with valid data', async () => {
        const newClassroom = {
            "owners": [user._id],
            "roomName": "Test Classroom 4"
        }

        await api
            .post('/api/classrooms')
            .set('authorization', 'bearer ' + jsonToken.token)
            .send(newClassroom)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const classroomsAtEnd = await helper.classroomsInDb()
        expect(classroomsAtEnd).toHaveLength(classroomObjects.length + 1)

        const roomNames = classroomsAtEnd.map(r => r.roomName)
        expect(roomNames).toContain('Test Classroom 4')
    })

    test('fails when no room name is submitted', async () => {
        const newClassroom = {
            "owners": [user._id],
            "roomName": ""
        }

        await api
            .post('/api/classrooms')
            .set('authorization', 'bearer ' + jsonToken.token)
            .send(newClassroom)
            .expect(400)

        const classroomsAtEnd = await helper.classroomsInDb()
        expect(classroomsAtEnd).toHaveLength(classroomObjects.length)
    })
})

describe('Deletion of a classroom', () => {
    test('is successful with valid id', async () => {
        await api
            .delete(`/api/classrooms/${classroomObjects[0]._id}`)
            .set('authorization', 'bearer ' + jsonToken.token)
            .expect(204)

        const classroomsAtEnd = await helper.classroomsInDb()
        expect(classroomsAtEnd).toHaveLength(classroomObjects.length - 1)
    })

    test('fails if classroom does not exist', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .delete(`/api/classrooms/${invalidId}`)
            .set('authorization', 'bearer ' + jsonToken.token)
            .expect(400)
        
        const classroomsAtEnd = await helper.classroomsInDb()
        expect(classroomsAtEnd).toHaveLength(classroomObjects.length)
    })
})