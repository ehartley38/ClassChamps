const { userExtractor } = require('../utils/middleware')
const assignmentRouter = require('express').Router()
const Assignment = require('../models/assignment')
const Classroom = require('../models/classroom')
const AssignmentSubmission = require('../models/assignmentSubmission')
const mongoose = require('mongoose')


// Create a new assignment
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
assignmentRouter.get('/classroom/:classroomId', userExtractor, async (request, response) => {
    const user = request.user
    const classroomId = request.params.classroomId
    const assignments = await Assignment.find({ classroomId: classroomId }).populate('quizId', 'quizType')

    response.json(assignments)
})

// Get leaderboard data for a given assignment
assignmentRouter.get('/leaderboard/:assignmentId', userExtractor, async (request, response) => {
    const user = request.user
    const assignmentId = request.params.assignmentId

    // Find all submissions, sort by time, then group by student, and select 
    // the first document in each group
    AssignmentSubmission.aggregate([
        { $match: { assignment: mongoose.Types.ObjectId(assignmentId) } },
        { $sort: { timeToComplete: 1 } },
        {
            $group: {
                _id: '$student',
                submission: { $first: '$$ROOT' }
            }
        }
    ]).exec((err, submissions) => {
        if (err) {
            console.log(err);
            return
        }
        console.log(submissions);
    })

})

module.exports = assignmentRouter