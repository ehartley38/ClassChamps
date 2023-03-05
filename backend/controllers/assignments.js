const { userExtractor } = require('../utils/middleware')
const assignmentRouter = require('express').Router()
const Assignment = require('../models/assignment')
const Classroom = require('../models/classroom')

assignmentRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const assignment = new Assignment({
        assignmentName: body.assignmentName,
        quizId: body.quizId,
        classroomId: body.classroomId,
        dueDate: body.dueDate
    })

    try {
        const classroom = await Classroom.findById(body.classroomId)
        if (classroom.owners.includes(user._id)) {
            const savedAssignment = await assignment.save()
            response.status(201).json(savedAssignment)
        } else {
            response.status(401).end()
        }
    } catch (err) {
        response.status(400).json(err)
    }
})

// Get all assignments for a given classroom
assignmentRouter.get('/classroom/:classroomId', userExtractor, async (request,response) => {
    const user = request.user
    const classroomId = request.params.classroomId
    const assignments = await Assignment.find({ classroomId: classroomId })

    response.json(assignments)
})

module.exports = assignmentRouter