const User = require('../models/user')
const Classroom = require('../models/classroom')

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const classroomsInDb = async () => {
    const classrooms = await Classroom.find({})
    return classrooms.map(c => c.toJSON())
}


const generateTeachersInitialClassrooms = (teacherId) => {
    const studentId = "63fcf1bddfe6c42656baf4e2"

    const initialClassrooms = [
        // Classrooms with owners
        {
            _id: "5f9f1b9b9c9d440000a1b0f0",
            owners: [teacherId],
            quizzes: [],
            roomName: "Test Classroom 0",
            students: [studentId],
            roomCode: ""
        },
        {
            _id: "5f9f1b9b9c9d440000a1b0f1",
            owners: [teacherId],
            quizzes: [],
            roomName: "Test Classroom 1",
            students: [studentId],
            roomCode: ""
        },
        {
            _id: "5f9f1b9b9c9d440000a1b0f2",
            owners: [teacherId],
            quizzes: [],
            roomName: "Test Classroom 2",
            students: [studentId],
            roomCode: ""
        },
        // Classroom with no owner
        {
            _id: "5f9f1b9b9c9d440000a1b0f3",
            owners: [],
            quizzes: [],
            roomName: "Test Classroom 3",
            students: [],
            roomCode: ""
        }
    ]

    return initialClassrooms
}

const generateStudentsInitialClassrooms = (studentId) => {
    const teacherId = "63fcf1bddfe6c42656baf4e2"

    const initialClassrooms = [
        // Classrooms with owners
        {
            _id: "5f9f1b9b9c9d440000a1b0f0",
            owners: [teacherId],
            quizzes: [],
            roomName: "Test Classroom 0",
            students: [studentId],
            roomCode: ""
        },
        {
            _id: "5f9f1b9b9c9d440000a1b0f1",
            owners: [teacherId],
            quizzes: [],
            roomName: "Test Classroom 1",
            students: [studentId],
            roomCode: ""
        },
        {
            _id: "5f9f1b9b9c9d440000a1b0f2",
            owners: [teacherId],
            quizzes: [],
            roomName: "Test Classroom 2",
            students: [studentId],
            roomCode: ""
        },
        // Classroom with no owner or students
        {
            _id: "5f9f1b9b9c9d440000a1b0f3",
            owners: [],
            quizzes: [],
            roomName: "Test Classroom 3",
            students: [],
            roomCode: ""
        }
    ]

    return initialClassrooms
}

// Count the number of classroms that have a owner with the given id 
const countClassroomsWithTeacher = async (teacherId, classrooms) => {
    let count = 0
    for (let i = 0; i < classrooms.length; i++) {
        if (classrooms[i].owners.includes(teacherId)) {
            count++
        }
    }
    return count
}






module.exports = {
    usersInDb, classroomsInDb, generateTeachersInitialClassrooms, 
    countClassroomsWithTeacher, generateStudentsInitialClassrooms
}